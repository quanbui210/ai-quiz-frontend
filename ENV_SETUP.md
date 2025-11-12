# Environment Variables Setup

## Quick Start

1. Create a `.env` file in the root directory
2. Copy the contents below into your `.env` file
3. Update the values as needed

## Required Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Complete .env Template

Create a `.env` file with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=LearnAI
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI/OpenAI Configuration (for future AI features)
# NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
# NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google OAuth (if needed on frontend)
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Feature Flags (for enabling/disabling features)
# NEXT_PUBLIC_ENABLE_RAG=true
# NEXT_PUBLIC_ENABLE_AI_TUTOR=true

# Analytics (optional)
# NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Environment
NODE_ENV=development
```

## Variable Descriptions

### Required Variables

- **NEXT_PUBLIC_API_URL** - Your backend API URL (default: `http://localhost:3001/api`)
  - This is where all API requests will be sent
  - Make sure your backend is running on this URL

### Optional Variables (for future use)

- **NEXT_PUBLIC_APP_NAME** - Application name (default: "LearnAI")
- **NEXT_PUBLIC_APP_URL** - Frontend application URL
- **NEXT_PUBLIC_OPENAI_API_KEY** - OpenAI API key for AI features
- **NEXT_PUBLIC_ANTHROPIC_API_KEY** - Anthropic API key (alternative AI provider)
- **NEXT_PUBLIC_GOOGLE_CLIENT_ID** - Google OAuth client ID (if needed on frontend)
- **NEXT_PUBLIC_ENABLE_RAG** - Enable RAG (Retrieval Augmented Generation) features
- **NEXT_PUBLIC_ENABLE_AI_TUTOR** - Enable AI tutor features
- **NEXT_PUBLIC_ANALYTICS_ID** - Analytics tracking ID
- **NODE_ENV** - Environment mode (development/production)

## Important Notes

1. **NEXT_PUBLIC_*** prefix is required for variables that need to be accessible in the browser
2. Variables without this prefix are only available on the server side
3. Never commit your `.env` file to version control (it's already in `.gitignore`)
4. Always use `.env.example` as a template for team members

## Usage in Code

Access environment variables in your code:

```typescript
// Client-side (browser)
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// Server-side only
const secretKey = process.env.SECRET_KEY // Not accessible in browser
```

## Current Configuration

The API client is already configured to use `NEXT_PUBLIC_API_URL`:

- Location: `lib/api/client.ts`
- Default fallback: `http://localhost:3001/api`
- Used for all API requests

