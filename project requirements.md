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
- Model hot-swapping functionality - users can switch between any available Ollama models in real-time
- Model capability tooltips with parameter counts and thinking indicators - each model shows parameter size and brain icon in dropdown, with capability badges revealed on hover

**Next Priority**
- Examine AI-SDK for ways to make our chat more advanced (what UI sees vs what system sees, etc. ).

**Future Goals**
- Walk through AI-SDK ideas together.

**In Progress:**

**Known Issues:**
- None currently

**Recent Changes:**
- **COMPLETED: Capability Badges Moved to Tooltips (September 21, 2025)**
  - Moved colorful capability badges to hover tooltips for cleaner dropdown UI
  - Parameter count and brain icon remain visible in dropdown for quick reference
  - Tooltips appear on the right side when hovering over model items
  - Used shadcn/ui Tooltip component with proper accessibility
  - Maintains all existing functionality while reducing visual clutter
- **COMPLETED: Brain Icon for Thinking Models (September 21, 2025)**
  - Added purple brain icon next to models that can show their thinking process
  - Currently only Qwen3 displays the brain icon as it supports `<think>` tags
  - Brain icon appears between parameter count and capability badges
  - Easy visual indicator to identify which models offer reasoning transparency
  - Future models with thinking capabilities will automatically get the brain icon
- **COMPLETED: Model Parameter Count Tags (September 21, 2025)**
  - Added parameter count tags next to each model name in dropdown
  - Llama3: 8B parameters - "Conversation" (blue)
  - Gemma3: 9B parameters - "Fast" (green) 
  - Qwen3: 32B parameters - "Reasoning" (purple) + "Multilingual" (orange)
  - GPT-OSS: 20B parameters - "Conversation" (blue)
  - Parameter tags styled with monospace font and subtle gray background for easy identification
  - Layout: Model Name + Parameter Count (left) | Capability Badges (right)
- **COMPLETED: Colored Model Capability Badges (September 21, 2025)**
  - Updated model badges with colors and optimized to 1-2 badges per model
  - Color scheme: Blue=Conversation, Green=Speed, Purple=Reasoning, Orange=Multilingual, Gray=General
  - Used Tailwind color classes with outline badge variant for better visibility
- **COMPLETED: Advanced Think Tag Handling & Reasoning (September 21, 2025)**
  - Fixed React component error when Qwen model outputs `<think>` tags during streaming
  - Updated implementation to follow official AI SDK Reasoning component patterns
  - Added support for both manual think tag parsing (Qwen) and native reasoning parts (future models)
  - Implemented robust parsing with comprehensive edge case handling for malformed/incomplete tags
  - Added aggressive tag cleanup to prevent any think tag fragments from reaching React components
  - Enhanced with thinking duration tracking - shows "Thinking..." during streaming, "Thought for X seconds" when complete
  - Compared and aligned with Vercel Labs reasoning starter template for best practices
  - Added automatic timing calculation for thinking duration display
  - Configured proper auto-open/close behavior matching AI SDK standards
  - Added `sendReasoning: true` to API response for better AI SDK integration
  - Think content displays in collapsible "Thinking" section with proper animations and timing
  - Tested with all edge cases - confirmed working without any React errors
- **COMPLETED: Model Hot-Swapping (September 21, 2025)**
  - Fixed model selection to work dynamically in real-time
  - Frontend now sends selected model parameter with each chat request
  - API route accepts and uses the model parameter instead of hardcoded value
  - Users can switch between any available Ollama models (llama3, gemma3, qwen3, gpt-oss) at any time
  - Model dropdown populated from live Ollama server via /api/models endpoint
  - Tested with multiple models - confirmed working correctly
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


