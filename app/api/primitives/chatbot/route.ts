import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, tool, UIMessage } from "ai"
import { z } from "zod"

export const maxDuration = 30

// Configure OpenAI provider to use local Ollama server
const openai = createOpenAI({
  baseURL: 'http://192.168.1.246:11434/v1',
  apiKey: 'ollama', // Required but not used by Ollama
  fetch: async (url, options) => {
    console.log('Making request to:', url)
    console.log('Request options:', options)
    const response = await fetch(url, options)
    console.log('Response status:', response.status)
    return response
  }
})

export async function POST(req: Request) {
  try {
    const { messages, model }: { messages: UIMessage[]; model?: string } = await req.json()

    const selectedModel = model || "llama3:latest"
    console.log('Processing chat request with messages:', messages)
    console.log('Using model:', selectedModel)
    
    // Convert messages to the format expected by the AI SDK
    const modelMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content || msg.parts?.find(p => p.type === 'text')?.text || ''
    }))
    
    console.log('Converted messages:', modelMessages)
    
    const result = streamText({
      model: openai.chat(selectedModel), // Use the selected model dynamically
      system: "You are a helpful assistant.",
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}
