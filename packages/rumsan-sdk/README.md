# Rumsan SDK

A JavaScript/TypeScript SDK for interfacing with Rumsan applications.

## Installation

```bash
npm install @rumsan/sdk
```

Or with yarn:

```bash
yarn add @rumsan/sdk
```

Or with pnpm:

```bash
pnpm add @rumsan/sdk
```

## Usage

```typescript
import { AppClient } from '@rumsan/sdk/clients';

// Initialize a client
const appClient = new AppClient({
  baseUrl: 'https://api.example.com',
});

// Use the client
const data = await appClient.getData();
```

## Available Modules

The SDK exports the following modules:

- **Clients**: API clients for interacting with Rumsan services
- **Constants**: Common constants used across the SDK
- **Types**: TypeScript type definitions
- **Utils**: Utility functions

## License

MIT
