'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertProvider, useAlert } from '@rumsan/ui';
import { CodeSnippet } from '@rumsan/ui/components/code-snippet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rumsan/shadcn/components/card';
import { Button } from '@rumsan/shadcn/components/button';
import { Badge } from '@rumsan/shadcn/components/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rumsan/shadcn/components/tabs';
import { Separator } from '@rumsan/shadcn/components/separator';
import { Switch } from '@rumsan/shadcn/components/switch';
import { Label } from '@rumsan/shadcn/components/label';

function AlertDemoContent() {
  const [showClosableAlert, setShowClosableAlert] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');

  const alert = useAlert();

  const handleProgrammaticAlert = async (
    type: 'success' | 'error' | 'warning' | 'info',
  ) => {
    const messages = {
      success: {
        title: 'Success!',
        description: 'Operation completed successfully.',
      },
      error: {
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      },
      warning: {
        title: 'Warning',
        description: 'This action cannot be undone.',
      },
      info: {
        title: 'Information',
        description: 'Here is some important information.',
      },
    };

    await alert[type](messages[type].title, {
      description: messages[type].description,
      mode: 'dialog',
    });
  };

  const handleConfirmDialog = async () => {
    const confirmed = await alert.confirm('Delete this item?', {
      description: 'This action cannot be undone.',
      variant: 'error',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      await alert.success('Item deleted successfully');
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alert Components Demo</h1>
          <p className="text-muted-foreground">
            Interactive examples of Alert components from @rumsan/ui with
            different variants, sizes, and programmatic usage
          </p>
        </div>
        <Badge variant="secondary">@rumsan/ui</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Component Controls</CardTitle>
            <CardDescription>
              Toggle different states of the alert component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-icon"
                checked={showIcon}
                onCheckedChange={setShowIcon}
              />
              <Label htmlFor="show-icon">Show Icon</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="closable"
                checked={showClosableAlert}
                onCheckedChange={setShowClosableAlert}
              />
              <Label htmlFor="closable">Closable Alert</Label>
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <div className="flex gap-2">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <Button
                    key={s}
                    variant={size === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSize(s)}
                  >
                    {s.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Programmatic Alerts</CardTitle>
            <CardDescription>
              Trigger alerts programmatically using the alert context
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgrammaticAlert('success')}
                className="text-green-700 border-green-300 hover:bg-green-50"
              >
                Success
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgrammaticAlert('error')}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                Error
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgrammaticAlert('warning')}
                className="text-orange-700 border-orange-300 hover:bg-orange-50"
              >
                Warning
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgrammaticAlert('info')}
                className="text-blue-700 border-blue-300 hover:bg-blue-50"
              >
                Info
              </Button>
            </div>
            <Separator />
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirmDialog}
              className="w-full text-orange-700 border-orange-300 hover:bg-orange-50"
            >
              Confirm Dialog
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="variants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="variants">Alert Variants</TabsTrigger>
          <TabsTrigger value="programmatic">Programmatic Usage</TabsTrigger>
          <TabsTrigger value="toast">Toast Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Variants</CardTitle>
              <CardDescription>
                Different alert variants with customizable properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert
                variant="success"
                title="Success Alert"
                description="This is a success alert with an icon and description."
                size={size}
                showIcon={showIcon}
                onClose={
                  showClosableAlert
                    ? () => setShowClosableAlert(false)
                    : undefined
                }
                closeable={showClosableAlert}
              />

              <Alert
                variant="error"
                title="Error Alert"
                description="This is an error alert that indicates something went wrong."
                size={size}
                showIcon={showIcon}
              />

              <Alert
                variant="warning"
                title="Warning Alert"
                description="This is a warning alert to draw attention to important information."
                size={size}
                showIcon={showIcon}
              />

              <Alert
                variant="info"
                title="Info Alert"
                description="This is an informational alert for general notifications."
                size={size}
                showIcon={showIcon}
              />

              <Alert
                variant="default"
                title="Default Alert"
                description="This is a default alert with neutral styling."
                size={size}
                showIcon={showIcon}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Content Alerts</CardTitle>
              <CardDescription>
                Alerts with custom React content and different configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="success" size={size} showIcon={showIcon}>
                <div className="space-y-2">
                  <h4 className="font-medium">Custom Success Content</h4>
                  <p className="text-sm">
                    You can add any React content here, including buttons and
                    links.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Action 1
                    </Button>
                    <Button size="sm">Action 2</Button>
                  </div>
                </div>
              </Alert>

              <Alert
                variant="warning"
                title="Non-closable Alert"
                description="This alert cannot be closed by the user."
                size={size}
                showIcon={showIcon}
                closeable={false}
              />

              <Alert variant="info" size={size} showIcon={false}>
                <div className="space-y-1">
                  <h4 className="font-medium">Alert without icon</h4>
                  <p className="text-sm">
                    This alert has showIcon set to false.
                  </p>
                </div>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programmatic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Programmatic Alert Examples</CardTitle>
              <CardDescription>
                Using the useAlert hook for programmatic alert management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Basic Alerts</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.success('Success!', {
                          description: 'Operation completed.',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Success Alert
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.error('Error!', {
                          description: 'Something went wrong.',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Error Alert
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.warning('Warning!', {
                          description: 'Please be careful.',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Warning Alert
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.info('Info!', {
                          description: 'Here is some information.',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Info Alert
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Advanced Features</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const result = await alert.confirm('Are you sure?', {
                          description: 'This action cannot be undone.',
                          confirmLabel: 'Yes, continue',
                          cancelLabel: 'Cancel',
                        });
                        console.log('Confirmed:', result);
                      }}
                      className="w-full justify-start"
                    >
                      Confirm Dialog
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.show({
                          title: 'Custom Alert',
                          description: 'Fully customizable alert dialog.',
                          variant: 'info',
                          size: 'lg',
                          confirmLabel: 'Got it',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Custom Alert
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Toast Alert Examples</CardTitle>
              <CardDescription>
                Using the useAlert hook for toast notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Basic Toast Alerts</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.success('Success!', {
                          description: 'Operation completed successfully.',
                          mode: 'toast',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Success Toast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.error('Error!', {
                          description: 'Something went wrong.',
                          mode: 'toast',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Error Toast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.warning('Warning!', {
                          description: 'Please be careful.',
                          mode: 'toast',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Warning Toast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.info('Info!', {
                          description: 'Here is some information.',
                          mode: 'toast',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Info Toast
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Advanced Toast Features</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.success('Action completed!', {
                          description: 'Your changes have been saved.',
                          mode: 'toast',
                          duration: 6000,
                        })
                      }
                      className="w-full justify-start"
                    >
                      Toast with Custom Duration
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.show({
                          title: 'Custom Toast',
                          description: 'Fully customizable toast notification.',
                          variant: 'info',
                          mode: 'toast',
                          confirmLabel: 'Got it',
                        })
                      }
                      className="w-full justify-start"
                    >
                      Custom Toast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert.warning('Important Notice', {
                          description: 'This action cannot be undone.',
                          mode: 'toast',
                          duration: 8000,
                        })
                      }
                      className="w-full justify-start"
                    >
                      Long Duration Toast
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            Code snippets showing how to use the Alert components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Alert</TabsTrigger>
              <TabsTrigger value="programmatic">Programmatic</TabsTrigger>
              <TabsTrigger value="toast">Toast</TabsTrigger>
              <TabsTrigger value="provider">With Provider</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <CodeSnippet
                code={`import { Alert } from "@rumsan/ui";

<Alert
  variant="success"
  title="Success!"
  description="Your changes have been saved."
  onClose={() => console.log('Alert closed')}
/>`}
                snippetId="basic-alert"
              />
            </TabsContent>

            <TabsContent value="programmatic">
              <CodeSnippet
                code={`import { useAlert } from "@rumsan/ui";

function MyComponent() {
  const alert = useAlert();

  const handleAction = async () => {
    await alert.success('Success!', {
      description: 'Operation completed successfully.',
      mode: 'dialog',
    });
  };

  const handleConfirm = async () => {
    const confirmed = await alert.confirm('Delete item?', {
      description: 'This cannot be undone.',
      variant: 'error',
    });

    if (confirmed) {
      // Handle deletion
    }
  };

  return (
    <button onClick={handleAction}>Show Alert</button>
  );
}`}
                snippetId="programmatic-alert"
              />
            </TabsContent>

            <TabsContent value="toast">
              <CodeSnippet
                code={`import { useAlert } from "@rumsan/ui";

function MyComponent() {
  const alert = useAlert();

  const handleSuccess = async () => {
    await alert.success('Success!', {
      description: 'Operation completed successfully.',
      mode: 'toast',
      duration: 4000, // Auto-dismiss after 4 seconds
    });
  };

  const handleCustomToast = async () => {
    await alert.show({
      title: 'Custom Toast',
      description: 'This is a custom toast notification.',
      variant: 'info',
      mode: 'toast',
      duration: 6000,
    });
  };

  return (
    <button onClick={handleSuccess}>Show Success Toast</button>
  );
}`}
                snippetId="toast-alert"
              />
            </TabsContent>

            <TabsContent value="provider">
              <CodeSnippet
                code={`import { AlertProvider } from "@rumsan/ui";

export default function App() {
  return (
    <AlertProvider defaultMode="dialog">
      <YourAppComponents />
    </AlertProvider>
  );
}`}
                snippetId="alert-provider"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AlertDemo() {
  return (
    <AlertProvider defaultMode="dialog">
      <AlertDemoContent />
    </AlertProvider>
  );
}
