# Alert System

A comprehensive, reusable alert dialog system built with React, Radix UI, and Tailwind CSS. This system provides multiple ways to display alerts and confirmations with excellent accessibility, responsiveness, and customization options.

## Features

- ✅ **Multiple Variants**: Success, error, warning, info, and default alerts with distinct colors and icons
- ✅ **Three Display Modes**: Dialog (modal), toast (sonner), and fallback (browser alert)
- ✅ **Fully Accessible**: Following WAI-ARIA guidelines with proper roles and labels
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Customizable**: Extensive styling and configuration options
- ✅ **Async Support**: Handle asynchronous operations with loading states
- ✅ **Smooth Animations**: Built-in animations for opening and closing
- ✅ **TypeScript**: Full type safety and IntelliSense support
- ✅ **Easy Integration**: Simple setup with provider pattern

## Installation

The alert system is part of the `@rumsan/ui` package:

```bash
npm install @rumsan/ui
# or
pnpm add @rumsan/ui
# or
yarn add @rumsan/ui
```

## Quick Start

### 1. Setup the Provider

Wrap your app with the `AlertProvider`:

```tsx
import { AlertProvider } from '@rumsan/ui';

function App() {
  return (
    <AlertProvider defaultMode="dialog">
      <YourAppComponents />
    </AlertProvider>
  );
}
```

### 2. Use the Hook

```tsx
import { useAlert } from '@rumsan/ui';

function MyComponent() {
  const alert = useAlert();

  const handleDelete = async () => {
    const confirmed = await alert.confirm('Delete this item?', {
      description: 'This action cannot be undone.',
      variant: 'error',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      // Perform deletion
      await alert.success('Item deleted successfully!');
    }
  };

  return <button onClick={handleDelete}>Delete Item</button>;
}
```

## Components

### Alert (Basic Alert Component)

Display inline alerts with customizable variants and content.

```tsx
import { Alert } from '@rumsan/ui';

<Alert
  variant="success"
  title="Success!"
  description="Your changes have been saved."
  onClose={() => console.log('Alert closed')}
/>;
```

#### Props

| Prop          | Type                                                       | Default     | Description            |
| ------------- | ---------------------------------------------------------- | ----------- | ---------------------- |
| `variant`     | `'success' \| 'error' \| 'warning' \| 'info' \| 'default'` | `'default'` | Alert variant          |
| `title`       | `string`                                                   | -           | Alert title            |
| `description` | `string`                                                   | -           | Alert description      |
| `size`        | `'sm' \| 'md' \| 'lg'`                                     | `'md'`      | Alert size             |
| `showIcon`    | `boolean`                                                  | `true`      | Show variant icon      |
| `closeable`   | `boolean`                                                  | `true`      | Show close button      |
| `onClose`     | `() => void`                                               | -           | Close handler          |
| `className`   | `string`                                                   | -           | Additional CSS classes |

### AlertProvider

Provides alert context to your application.

```tsx
import { AlertProvider } from '@rumsan/ui';

<AlertProvider defaultMode="dialog">
  <App />
</AlertProvider>;
```

#### Props

| Prop          | Type                                | Default    | Description          |
| ------------- | ----------------------------------- | ---------- | -------------------- |
| `defaultMode` | `'dialog' \| 'toast' \| 'fallback'` | `'dialog'` | Default display mode |
| `children`    | `ReactNode`                         | -          | App content          |

## Hook API

### useAlert()

The main hook for programmatic alert usage.

```tsx
const alert = useAlert();
```

#### Methods

##### alert.success(title, options?)

Show a success alert.

```tsx
await alert.success('Operation completed!', {
  description: 'Your data has been saved.',
  mode: 'toast',
});
```

##### alert.error(title, options?)

Show an error alert.

```tsx
await alert.error('Something went wrong', {
  description: 'Please try again.',
  mode: 'dialog',
});
```

##### alert.warning(title, options?)

Show a warning alert.

```tsx
await alert.warning('Are you sure?', {
  description: 'This action has consequences.',
});
```

##### alert.info(title, options?)

Show an info alert.

```tsx
await alert.info('New feature available', {
  description: 'Check out our latest update!',
});
```

##### alert.confirm(title, options?)

Show a confirmation dialog.

```tsx
const confirmed = await alert.confirm('Delete item?', {
  description: 'This cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Keep',
  variant: 'error',
});

if (confirmed) {
  // User confirmed
}
```

##### alert.show(options)

Show a fully customized alert.

```tsx
await alert.show({
  title: 'Custom Alert',
  description: 'Fully customizable alert.',
  variant: 'warning',
  size: 'lg',
  mode: 'dialog',
  confirmLabel: 'Continue',
  cancelLabel: 'Back',
  onConfirm: async () => {
    // Custom async logic
  },
});
```

## Configuration Options

### AlertOptions

| Option         | Type                                                       | Default          | Description         |
| -------------- | ---------------------------------------------------------- | ---------------- | ------------------- |
| `title`        | `string`                                                   | -                | Alert title         |
| `description`  | `string`                                                   | -                | Alert description   |
| `variant`      | `'success' \| 'error' \| 'warning' \| 'info' \| 'default'` | `'default'`      | Alert variant       |
| `mode`         | `'dialog' \| 'toast' \| 'fallback'`                        | Provider default | Display mode        |
| `size`         | `'sm' \| 'md' \| 'lg' \| 'xl'`                             | `'md'`           | Dialog size         |
| `confirmLabel` | `string`                                                   | `'Continue'`     | Confirm button text |
| `cancelLabel`  | `string`                                                   | `'Cancel'`       | Cancel button text  |
| `showIcon`     | `boolean`                                                  | `true`           | Show variant icon   |
| `loading`      | `boolean`                                                  | `false`          | Show loading state  |
| `duration`     | `number`                                                   | `4000`           | Toast duration (ms) |
| `onConfirm`    | `() => void \| Promise<void>`                              | -                | Confirm handler     |
| `onCancel`     | `() => void`                                               | -                | Cancel handler      |
| `className`    | `string`                                                   | -                | Custom CSS classes  |

## Display Modes

### Dialog Mode (Default)

Shows alerts as modal dialogs using Radix UI Dialog primitives.

```tsx
await alert.info('Dialog Alert', { mode: 'dialog' });
```

### Toast Mode

Shows alerts as toast notifications using Sonner.

```tsx
await alert.success('Toast Alert', {
  mode: 'toast',
  duration: 3000,
});
```

### Fallback Mode

Uses browser's native `confirm()` dialog as fallback.

```tsx
const result = await alert.confirm('Fallback Alert', {
  mode: 'fallback',
});
```

## Advanced Examples

### Async Operations with Loading

```tsx
const handleAsyncOperation = async () => {
  const confirmed = await alert.confirm('Process data?', {
    description: 'This will take a few seconds.',
    onConfirm: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Data processed');
    },
  });
};
```

### Custom Styling

```tsx
await alert.show({
  title: 'Custom Styled Alert',
  variant: 'info',
  size: 'lg',
  className: 'custom-alert-title',
  contentClassName: 'p-8',
  headerClassName: 'border-b pb-4',
  footerClassName: 'pt-4',
});
```

### Form Validation Alerts

```tsx
const validateForm = async (formData) => {
  if (!formData.email) {
    await alert.error('Validation Error', {
      description: 'Email is required.',
      mode: 'toast',
    });
    return false;
  }
  return true;
};
```

## Accessibility Features

- **ARIA Labels**: Proper `role="alert"` and `aria-live` attributes
- **Keyboard Navigation**: Full keyboard support for dialogs
- **Screen Reader Support**: Descriptive labels and announcements
- **Focus Management**: Proper focus trapping in modal dialogs
- **High Contrast**: Works with system high contrast modes

## Responsive Design

- **Mobile Optimized**: Touch-friendly buttons and spacing
- **Flexible Sizing**: Responsive dialog sizes
- **Breakpoint Aware**: Different layouts for mobile/desktop

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- iOS Safari 14+
- Android Chrome 88+

## Contributing

See the main project [README](../../README.md) for contribution guidelines.

## License

MIT - See [LICENSE](../../LICENSE) for details.
