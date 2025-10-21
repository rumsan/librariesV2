# @rumsan/shadcn

A comprehensive React component library built with Radix UI and Tailwind CSS, providing modern, accessible, and customizable UI components.

## Features

- 🎨 **Modern Design**: Built with Tailwind CSS for consistent styling
- ♿ **Accessible**: All components built on Radix UI primitives
- 🎯 **Tree-shakeable**: Import only what you need
- 📦 **TypeScript Ready**: Full TypeScript support with type definitions
- 🎪 **Customizable**: Easy to customize with CSS variables and Tailwind
- 🚀 **Performance**: Optimized for bundle size and runtime performance

## Installation

```bash
npm install @rumsan/shadcn
# or
pnpm add @rumsan/shadcn
# or
yarn add @rumsan/shadcn
```

### Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
npm install react react-dom
```

## Quick Start

Import components individually for optimal bundle size:

```tsx
import { Button } from "@rumsan/shadcn/components/button";
import { Dialog } from "@rumsan/shadcn/components/dialog";
import { cn } from "@rumsan/shadcn/lib/utils";

function App() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```

Or import from the main entry point:

```tsx
import { Button, Dialog, cn } from "@rumsan/shadcn";
```

## CSS Setup

Import the CSS in your main application file:

```tsx
import "@rumsan/shadcn/globals.css";
```

## Available Components

- **Layout**: Card, Separator, Aspect Ratio
- **Navigation**: Breadcrumb, Navigation Menu, Pagination, Sidebar
- **Forms**: Button, Input, Label, Checkbox, Radio Group, Select, Switch, Textarea
- **Data Display**: Avatar, Badge, Table, Progress, Skeleton
- **Feedback**: Alert, Alert Dialog, Toast (Sonner)
- **Overlay**: Dialog, Drawer, Sheet, Hover Card, Popover, Tooltip
- **Media**: Calendar, Carousel, Chart
- **Utility**: Command, Context Menu, Dropdown Menu, Menubar, Tabs, Toggle

## Individual Component Imports

For better tree-shaking, you can import components individually:

```tsx
// Components
import { Button } from "@rumsan/shadcn/components/button";
import { Input } from "@rumsan/shadcn/components/input";
import { Dialog } from "@rumsan/shadcn/components/dialog";

// Utilities
import { cn } from "@rumsan/shadcn/lib/utils";

// Hooks  
import { useIsMobile } from "@rumsan/shadcn/hooks/use-mobile";
```

## Styling

This library uses Tailwind CSS. Make sure your project has Tailwind configured. The components are designed to work with CSS variables for theming.

## TypeScript Support

All components are fully typed and provide excellent TypeScript support out of the box.

```tsx
import type { ButtonProps } from "@rumsan/shadcn/components/button";

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Development

This package is part of a monorepo and uses:

- **TypeScript** for type safety
- **Tailwind CSS** for styling  
- **Radix UI** for accessible primitives
- **tsup** for building
- **ESM** module format

## License

MIT