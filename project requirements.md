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

## current status

**Working:**
- Basic Next.js setup with TypeScript and Tailwind
- UI component library (shadcn/ui) installed
- AI SDK components installed and integrated (@ai-elements/all)
- Complete chat interface UI with message handling, loading states, and responsive design
- API route for chat functionality with OpenAI integration
- Updated chatbot component to use ai-sdk components instead of prompt-kit

**Next Priority**
- Install ollama provider for ai-sdk https://github.com/jagreehal/ai-sdk-ollama
- Connect chat interface UI to local ubuntu server, docker ollama http://192.168.1.246:11434

**Future Goals**
- Install ollama provider for ai-sdk https://github.com/jagreehal/ai-sdk-ollama
- Connect chat interface UI to local ubuntu server, docker ollama http://192.168.1.246:11434

**In Progress:**


**Known Issues:**

**Recent Changes:**
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


