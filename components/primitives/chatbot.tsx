"use client"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
} from "@/components/ai-elements/prompt-input"
import { Response } from "@/components/ai-elements/response"
import { Loader } from "@/components/ai-elements/loader"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import {
  AlertTriangle,
  Copy,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { memo, useState, Fragment } from "react"

type MessageComponentProps = {
  message: UIMessage
  isLastMessage: boolean
}

export const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    return (
      <div key={message.id}>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return (
                <Fragment key={`${message.id}-${i}`}>
                  <Message from={message.role}>
                    <MessageContent>
                      <Response>
                        {part.text}
                      </Response>
                    </MessageContent>
                  </Message>
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
                </Fragment>
              );
            default:
              return null;
          }
        })}
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

function ConversationPromptInput() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/primitives/chatbot",
    }),
  })

  const handleSubmit = (message: { text?: string; files?: any[] }, event: React.FormEvent<HTMLFormElement>) => {
    if (!message.text?.trim()) return

    sendMessage({ text: message.text })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
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
                />
              )
            })}

            {status === "submitted" && <LoadingMessage />}
            {status === "error" && error && <ErrorMessage error={error} />}
          </ConversationContent>
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask anything"
            />
          </PromptInputBody>
          <div className="flex items-center justify-end p-2">
            <PromptInputSubmit 
              status={error ? "error" : status}
              disabled={status === "submitted" || status === "streaming"}
            />
          </div>
        </PromptInput>
      </div>
    </div>
  )
}

export default ConversationPromptInput
