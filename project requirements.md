# project requirements

## overview
An AI assistant web application named Boris, built as a modern chat interface using Next.js 15 with React 19. The application provides a conversational AI experience with streaming responses, markdown rendering, and a clean, responsive user interface that's mobile friendly. Built for local network usage first.

## Installed Tools

- **Next.js 15**: React framework for server-side rendering and static site generation.
- **React 19**: Latest version of React for building user interfaces.
- **shadcn/ui**: Component library for building modern UIs.
- **prompt-kit**: Tooling for AI prompt management and registry.
- **Vercel AI SDK**: Framework for building AI-powered applications with streaming responses.
- **lucide**: Icon library for React applications.
- **Other dependencies**: Standard Next.js and React tooling (e.g., ESLint, Prettier, etc.).

## AI SDK Reference Examples
When working with ai-sdk components, always reference these strong examples:
- **Chatbot Example**: https://ai-sdk.dev/elements/examples/chatbot - Complete chatbot implementation with proper message handling, Response component usage, and conversation flow
- **v0 Clone Example**: https://ai-sdk.dev/elements/examples/v0 - Advanced implementation showing WebPreview, Suggestions, and complex UI patterns

## current status

**Working:**
- Basic Next.js setup with TypeScript and Tailwind
- UI component library (shadcn/ui) installed
- AI SDK components installed and integrated (@ai-elements/all)
- Complete chat interface UI with message handling, loading states, and responsive design
- API route for chat functionality with local Ollama integration (http://192.168.1.246:11434)
- Updated chatbot component to use ai-sdk components instead of prompt-kit

**Next Priority**

**Future Goals**
- Examine AI-SDK for ways to make our chat more advanced (what UI sees vs what system sees, etc. ).
- Walk through AI-SDK ideas together.

**In Progress:**

**Known Issues:**

**Recent Changes:**
- **COMPLETED: Ollama Integration**
  - Successfully connected chat interface to local Ollama server (http://192.168.1.246:11434)
  - Fixed AI SDK endpoint issue by using openai.chat() method for chat completions
  - Configured to use llama3:latest model from local Ollama instance
  - Streaming responses working correctly with real-time text generation
  - Maintained all existing functionality (tools, streaming, UI components)
- **REVERTED: Back to clean state**
  - Reverted all Ollama integration attempts due to complexity
  - Back to working OpenAI integration as baseline
  - Ready to try a simpler approach for local Ollama connection
- Fixed message UI issues by following ai-sdk chatbot example pattern
- Updated MessageComponent to properly handle message parts with Response component
- Replaced custom loader with proper ai-sdk Loader component
- Simplified conversation layout to match ai-sdk examples
- Fixed user message positioning and loader display issues
- Removed prompt-kit components and dependencies
- Installed ai-sdk components (@ai-elements/all) using shadcn CLI
- Updated chatbot component to use new ai-sdk components
- Removed prompt-kit MCP configuration from cursor settings
- Updated project to use ai-sdk's built-in component library


