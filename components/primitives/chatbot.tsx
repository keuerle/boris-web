"use client"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from "@/components/ai-elements/prompt-input"
import { Response } from "@/components/ai-elements/response"
import { Loader } from "@/components/ai-elements/loader"
import { 
  Reasoning, 
  ReasoningContent, 
  ReasoningTrigger
} from "@/components/ai-elements/reasoning"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import {
  AlertTriangle,
  Brain,
  ChevronDown,
  Copy,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { memo, useState, Fragment, useEffect } from "react"

// Utility function to parse think tags from content
function parseThinkContent(text: string) {
  // Check for complete think tags first
  const completeThinkRegex = /<think>([\s\S]*?)<\/think>/g
  const matches = []
  let match
  let cleanText = text

  while ((match = completeThinkRegex.exec(text)) !== null) {
    matches.push(match[1].trim())
    // Remove the complete think tags from the main content
    cleanText = cleanText.replace(match[0], '').trim()
  }

  // Check for incomplete think tags (during streaming)
  const hasOpenThink = text.includes('<think>') && !text.includes('</think>')
  
  if (hasOpenThink) {
    // During streaming, hide everything until think tag is complete
    // This prevents React from trying to parse incomplete think tags
    const thinkStartIndex = text.indexOf('<think>')
    const beforeThink = text.substring(0, thinkStartIndex).trim()
    
    return {
      thinkingContent: null, // Don't show thinking until complete
      mainContent: beforeThink || '', // Only show content before think tag
      isStreaming: true
    }
  }

  // Additional safety: remove any remaining think tag fragments that might have been missed
  // This handles incomplete tags, broken tags, and any think-related content
  cleanText = cleanText.replace(/<\/?think[^>]*>/g, '').replace(/<think[^>]*$/g, '').trim()

  return {
    thinkingContent: matches.length > 0 ? matches.join('\n\n') : null,
    mainContent: cleanText || text,
    isStreaming: false
  }
}

// Safe wrapper for Response component that pre-cleans content
const SafeResponse = ({ children, ...props }: { children: string } & any) => {
  // Aggressively clean any think tags before they reach Streamdown
  const cleanContent = String(children || '')
    .replace(/<think[\s\S]*?<\/think>/g, '') // Remove complete think blocks
    .replace(/<\/?think[^>]*>/g, '') // Remove any think tag fragments
    .replace(/<think[^>]*$/g, '') // Remove incomplete think tags at end
    .trim()
  
  return (
    <Response {...props}>
      {cleanContent}
    </Response>
  )
}

// Safe wrapper for ReasoningContent that pre-cleans content
const SafeReasoningContent = ({ children, ...props }: { children: string } & any) => {
  // Aggressively clean any think tags before they reach the reasoning content
  const cleanContent = String(children || '')
    .replace(/<think[\s\S]*?<\/think>/g, '') // Remove complete think blocks
    .replace(/<\/?think[^>]*>/g, '') // Remove any think tag fragments
    .replace(/<think[^>]*$/g, '') // Remove incomplete think tags at end
    .trim()
  
  return (
    <ReasoningContent {...props}>
      {cleanContent}
    </ReasoningContent>
  )
}

type MessageComponentProps = {
  message: UIMessage
  isLastMessage: boolean
  status?: 'ready' | 'submitted' | 'streaming' | 'error'
  allMessages?: UIMessage[]
}

export const MessageComponent = memo(
  ({ message, isLastMessage, status, allMessages }: MessageComponentProps) => {
    return (
      <div key={message.id}>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              // For Qwen models that don't have native reasoning support,
              // we still need to parse think tags manually
              const { thinkingContent, mainContent, isStreaming } = parseThinkContent(part.text)
              
              return (
                <Fragment key={`${message.id}-${i}`}>
                  {thinkingContent && (
                    <Reasoning 
                      key={`${message.id}-${i}-thinking`}
                      isStreaming={false}
                      defaultOpen={false}
                      className="mb-4"
                    >
                      <ReasoningTrigger>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Brain className="size-4" />
                          <p>Thought for a little...</p>
                          <ChevronDown className="size-4 transition-transform" />
                        </div>
                      </ReasoningTrigger>
                      <SafeReasoningContent>
                        {thinkingContent}
                      </SafeReasoningContent>
                    </Reasoning>
                  )}
                  
                  {isStreaming && (
                    <Reasoning 
                      key={`${message.id}-${i}-streaming`}
                      isStreaming={true} 
                      className="mb-4"
                    >
                      <ReasoningTrigger />
                      <SafeReasoningContent>
                        Processing thoughts...
                      </SafeReasoningContent>
                    </Reasoning>
                  )}
                  
                  {mainContent && (
                    <Message from={message.role} key={`${message.id}-${i}-text`}>
                      <MessageContent>
                        <SafeResponse>
                          {mainContent}
                        </SafeResponse>
                      </MessageContent>
                    </Message>
                  )}
                </Fragment>
              );
              
            case 'reasoning':
              // Handle native reasoning parts from models that support it
              const isReasoningStreaming = status === 'streaming' && 
                i === message.parts.length - 1 && 
                message.id === allMessages?.[allMessages.length - 1]?.id
              
              return (
                <Reasoning 
                  key={`${message.id}-${i}-reasoning`}
                  isStreaming={isReasoningStreaming}
                  className="mb-4"
                >
                  <ReasoningTrigger />
                  <SafeReasoningContent>
                    {part.text}
                  </SafeReasoningContent>
                </Reasoning>
              );
              
            default:
              return null;
          }
        })}
        
        {/* Show action buttons only once per message */}
        {message.role === 'assistant' && isLastMessage && (
          <div className="flex gap-2 mt-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Copy />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ThumbsUp />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ThumbsDown />
            </Button>
          </div>
        )}
      </div>
    )
  }
)

MessageComponent.displayName = "MessageComponent"

const LoadingMessage = memo(() => (
  <Loader />
))

LoadingMessage.displayName = "LoadingMessage"

const ErrorMessage = memo(({ error }: { error: Error }) => (
  <Message from="assistant">
    <MessageContent>
      <div className="flex items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1">
        <AlertTriangle size={16} className="text-red-500" />
        <p className="text-red-500">{error.message}</p>
      </div>
    </MessageContent>
  </Message>
))

ErrorMessage.displayName = "ErrorMessage"

type Model = {
  name: string
  value: string
  size?: number
  modified?: string
}

// Model capabilities mapping with colored badges, parameter counts, and thinking capability
const modelCapabilities: Record<string, { badges: Array<{name: string, color: string}>, parameters: string, canThink: boolean, description: string }> = {
  'llama3:latest': {
    badges: [{ name: 'Conversation', color: 'bg-blue-100 text-blue-800 border-blue-200' }],
    parameters: '8B',
    canThink: false,
    description: 'Cost-efficient open-source model great for general conversations'
  },
  'gemma3:latest': {
    badges: [{ name: 'Fast', color: 'bg-green-100 text-green-800 border-green-200' }],
    parameters: '9B',
    canThink: false,
    description: 'Google\'s efficient model optimized for fast responses'
  },
  'qwen3:latest': {
    badges: [
      { name: 'Reasoning', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      { name: 'Multilingual', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    ],
    parameters: '32B',
    canThink: true,
    description: 'Advanced reasoning capabilities with strong multilingual support'
  },
  'gpt-oss:latest': {
    badges: [{ name: 'Conversation', color: 'bg-blue-100 text-blue-800 border-blue-200' }],
    parameters: '20B',
    canThink: false,
    description: 'Open source alternative to GPT with similar capabilities'
  }
}

// Function to get model capabilities with fuzzy matching
function getModelCapabilities(modelValue: string): { badges: Array<{name: string, color: string}>, parameters: string, canThink: boolean, description: string } {
  // Direct match first
  if (modelCapabilities[modelValue]) {
    return modelCapabilities[modelValue]
  }
  
  // Fuzzy matching for different versions/tags
  const modelName = modelValue.toLowerCase()
  if (modelName.includes('llama3') || modelName.includes('llama-3')) {
    return modelCapabilities['llama3:latest']
  } else if (modelName.includes('gemma3') || modelName.includes('gemma-3')) {
    return modelCapabilities['gemma3:latest']
  } else if (modelName.includes('qwen3') || modelName.includes('qwen-3')) {
    return modelCapabilities['qwen3:latest']
  } else if (modelName.includes('gpt-oss')) {
    return modelCapabilities['gpt-oss:latest']
  }
  
  // Default for unknown models
  return { 
    badges: [{ name: 'General', color: 'bg-gray-100 text-gray-800 border-gray-200' }], 
    parameters: '?B',
    canThink: false,
    description: 'General purpose language model' 
  }
}

function ConversationPromptInput() {
  const [model, setModel] = useState("llama3:latest")
  const [input, setInput] = useState('')
  const [models, setModels] = useState<Model[]>([
    {
      name: 'Llama 3 (Local)',
      value: 'llama3:latest',
    },
  ])
  const [modelsLoading, setModelsLoading] = useState(true)
  
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/primitives/chatbot",
    }),
  })

  // Fetch available models from Ollama
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models')
        if (response.ok) {
          const data = await response.json()
          const formattedModels = data.models.map((m: any) => ({
            name: m.name.charAt(0).toUpperCase() + m.name.slice(1).replace(/[-_]/g, ' '),
            value: m.value,
            size: m.size,
            modified: m.modified
          }))
          setModels(formattedModels)
          // Set the first model as default if current model isn't available
          if (formattedModels.length > 0 && !formattedModels.find((m: Model) => m.value === model)) {
            setModel(formattedModels[0].value)
          }
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setModelsLoading(false)
      }
    }

    fetchModels()
  }, [model])

  const handleSubmit = (message: { text?: string; files?: any[] }, event: React.FormEvent<HTMLFormElement>) => {
    if (!message.text?.trim()) return

    sendMessage({ text: message.text }, { body: { model } })
    setInput('') // Clear the input after sending
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full conversation-scroll">
          <ConversationContent className="conversation-scroll">
            {messages.length === 0 && (
              <ConversationEmptyState
                title="Welcome to Boris"
                description="Start a conversation to see messages here"
              />
            )}
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1

              return (
                <MessageComponent
                  key={message.id}
                  message={message}
                  isLastMessage={isLastMessage}
                  status={status}
                  allMessages={messages}
                />
              )
            })}

            {status === "submitted" && <LoadingMessage />}
            {status === "error" && error && <ErrorMessage error={error} />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputModelSelect
                onValueChange={(value) => setModel(value)}
                value={model}
                disabled={modelsLoading}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue>
                    {modelsLoading ? "Loading models..." : models.find(m => m.value === model)?.name || "Select model"}
                  </PromptInputModelSelectValue>
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((modelOption) => {
                    const capabilities = getModelCapabilities(modelOption.value)
                    return (
                      <Tooltip key={`${modelOption.value}-tooltip`}>
                        <TooltipTrigger asChild>
                          <PromptInputModelSelectItem key={modelOption.value} value={modelOption.value}>
                            <div className="flex items-center gap-2 w-full">
                              <span>{modelOption.name}</span>
                              <Badge 
                                variant="outline" 
                                className="text-[9px] px-1 py-0.5 bg-slate-50 text-slate-600 border-slate-200 font-mono"
                              >
                                {capabilities.parameters}
                              </Badge>
                              {capabilities.canThink && (
                                <Brain className="size-3 text-purple-600" />
                              )}
                            </div>
                          </PromptInputModelSelectItem>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex gap-1">
                          {capabilities.badges.map((badge, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className={cn("text-[10px] px-1.5 py-0.5", badge.color)}
                            >
                              {badge.name}
                            </Badge>
                          ))}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit 
              status={error ? "error" : status}
              disabled={status === "submitted" || status === "streaming"}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  )
}

export default ConversationPromptInput
