# Publishing @rumsan/shadcn

## Pre-publish Checklist

1. **Version Bump**: Update the version in `package.json`
2. **Build**: Ensure the package builds successfully
3. **Test**: Verify imports work in the test app
4. **Documentation**: Update README if needed

## Local Testing

Before publishing, test the package locally:

```bash
# Build the package
cd packages/rumsan-shadcn
pnpm build

# Test in the monorepo
cd ../../apps/web  
pnpm dev
```

Visit `http://localhost:3000/test` to verify all components work.

## Publishing to NPM

```bash
# Make sure you're in the packages/rumsan-shadcn directory
cd packages/rumsan-shadcn

# Login to npm (if not already logged in)
npm login

# Publish (this will run prepublishOnly script automatically)
npm publish

# For scoped packages, you might need:
npm publish --access public
```

## Version Management

```bash
# Patch version (bug fixes)
npm version patch

# Minor version (new features)
npm version minor

# Major version (breaking changes)  
npm version major
```

## Package Structure

```
packages/rumsan-shadcn/
├── dist/                 # Built files (generated)
│   ├── index.js          # Main bundle
│   ├── index.d.ts        # Type definitions
│   └── styles/
│       └── globals.css   # CSS file
├── src/                  # Source files
│   ├── components/       # All UI components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utility functions
│   └── index.ts         # Main export file
├── package.json         # Package configuration
├── tsup.config.ts       # Build configuration
└── README.md           # Documentation
```

## Import Examples

After publishing, users can import components like this:

```tsx
// Individual imports (recommended)
import { Button } from "@rumsan/shadcn/components/button";
import { Card } from "@rumsan/shadcn/components/card";
import { cn } from "@rumsan/shadcn/lib/utils";

// Bulk import
import { Button, Card, cn } from "@rumsan/shadcn";

// CSS
import "@rumsan/shadcn/globals.css";
```