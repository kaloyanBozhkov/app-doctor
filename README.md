# App Doctor Backend

Express backend with TypeScript, Zod validation, and API key authentication.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create `.env` file:
```bash
NODE_ENV=development
PORT=3000
X_API_KEY=your-secret-api-key-here
```

3. Run development server:
```bash
pnpm dev
```

4. Build for production:
```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── queries/        # Request handlers organized by feature
├── services/       # Business logic layer
├── router/         # Express route definitions
├── helpers/        # Utility functions, validation
└── middleware/     # Middleware functions
```

## API

All routes (except `/api/health`) require `X-API-KEY` header.

- `GET /api/health` - Health check endpoint

## Deployment

Configured for Vercel. 

**Required Environment Variables in Vercel:**
- `X_API_KEY` - Your secret API key
- `NODE_ENV` - Set to `production`
- `PORT` - Set to `3000` (optional)

After deploying, push changes and Vercel will automatically redeploy.

