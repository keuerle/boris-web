import { createOpenAI } from "@ai-sdk/openai"

export const maxDuration = 30

// Configure OpenAI provider to use local Ollama server
const openai = createOpenAI({
  baseURL: 'http://192.168.1.246:11434/v1',
  apiKey: 'ollama', // Required but not used by Ollama
})

export async function GET() {
  try {
    // Fetch models from Ollama API
    const response = await fetch('http://192.168.1.246:11434/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Transform the models data to match our frontend format
    const models = data.models.map((model: any) => ({
      name: model.name.replace(':latest', ''),
      value: model.name,
      size: model.size,
      modified: model.modified_at
    }))

    return Response.json({ models })
  } catch (error) {
    console.error('Error fetching models:', error)
    return Response.json(
      { error: 'Failed to fetch models from Ollama' },
      { status: 500 }
    )
  }
}
