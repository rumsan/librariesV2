"use client";

import { useState } from "react";

// Individual component imports (recommended for tree-shaking)
import { Button } from "@rumsan/shadcn/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rumsan/shadcn/components/card";
import { Input } from "@rumsan/shadcn/components/input";
import { Label } from "@rumsan/shadcn/components/label";
import { Badge } from "@rumsan/shadcn/components/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@rumsan/shadcn/components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rumsan/shadcn/components/tabs";
import { Separator } from "@rumsan/shadcn/components/separator";
import { Switch } from "@rumsan/shadcn/components/switch";

// Bulk import for comparison
import { Alert, AlertDescription, AlertTitle, Checkbox } from "@rumsan/shadcn";

// Utilities
import { cn } from "@rumsan/shadcn/lib/utils";

// Hooks
import { useIsMobile } from "@rumsan/shadcn/hooks/use-mobile";

export default function ComponentsTestPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">@rumsan/shadcn Component Test</h1>
          <p className="text-muted-foreground">
            Testing both individual and bulk imports from the package
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">v0.0.0</Badge>
          <Badge variant={isMobile ? "default" : "outline"}>
            {isMobile ? "Mobile" : "Desktop"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="individual">Individual Imports</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Imports</TabsTrigger>
          <TabsTrigger value="interactive">Interactive</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <Alert>
            <AlertTitle>Individual Component Imports</AlertTitle>
            <AlertDescription>
              These components were imported individually from their specific paths for optimal tree-shaking.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>
                  From @rumsan/shadcn/components/button
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">Default Button</Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Small Secondary
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  Large Outline
                </Button>
                <Button variant="ghost" className="w-full">Ghost Button</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>
                  Input and Label components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="user@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="notifications"
                    checked={switchValue}
                    onCheckedChange={setSwitchValue}
                  />
                  <Label htmlFor="notifications">
                    Enable notifications
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dialog Component</CardTitle>
                <CardDescription>
                  Modal dialog functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Open Dialog
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Component Dialog Test</DialogTitle>
                      <DialogDescription>
                        This dialog was imported from @rumsan/shadcn/components/dialog.
                        It demonstrates that complex components work correctly.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        The dialog component is working correctly! ✅
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Alert>
            <AlertTitle>Bulk Import Test</AlertTitle>
            <AlertDescription>
              These components were imported from the main package entry point (bulk import).
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Components from Main Export</CardTitle>
              <CardDescription>
                Imported using: import {`{ Alert, Checkbox }`} from "@rumsan/shadcn"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bulk-checkbox"
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(!!checked)}
                />
                <Label htmlFor="bulk-checkbox">
                  This checkbox was imported via bulk import
                </Label>
              </div>
              
              {isChecked && (
                <Alert>
                  <AlertTitle>Checkbox State Changed!</AlertTitle>
                  <AlertDescription>
                    Both the Alert and Checkbox components are working from bulk imports.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactive" className="space-y-6">
          <Alert>
            <AlertTitle>Interactive Features</AlertTitle>
            <AlertDescription>
              Testing utilities and hooks from the package.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utility Function (cn)</CardTitle>
                <CardDescription>
                  Testing the cn utility for conditional classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    switchValue 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "bg-muted border-muted-foreground/20",
                    "hover:scale-105"
                  )}
                >
                  <p className="text-sm font-medium">
                    {switchValue ? "Switch is ON" : "Switch is OFF"}
                  </p>
                  <p className="text-xs mt-1 opacity-70">
                    This styling changes based on the switch state using the cn utility.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>useIsMobile Hook</CardTitle>
                <CardDescription>
                  Testing the mobile detection hook
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Device type:</strong> {isMobile ? "Mobile" : "Desktop"}
                  </p>
                  <p className="text-xs mt-2 opacity-70">
                    Try resizing your browser window to see this change.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Import Comparison</CardTitle>
          <CardDescription>
            Both import methods work, but individual imports are recommended for better tree-shaking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ Individual Imports (Recommended)
              </h4>
              <pre className="text-xs text-green-700 dark:text-green-300">
{`import { Button } from "@rumsan/shadcn/components/button";
import { Card } from "@rumsan/shadcn/components/card";
import { cn } from "@rumsan/shadcn/lib/utils";`}
              </pre>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Better for tree-shaking and smaller bundle sizes.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                ℹ️ Bulk Import (Also supported)
              </h4>
              <pre className="text-xs text-blue-700 dark:text-blue-300">
{`import { Button, Card, cn } from "@rumsan/shadcn";`}
              </pre>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                Convenient but may include unused code in bundle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}