'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DateSelectorField } from '@rumsan/ui/components/date-selector.field';
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
import { Alert, AlertDescription } from '@rumsan/shadcn/components/alert';

interface FormData {
  startDate: Date;
  endDate: Date;
}

export default function DateSelectorFieldDemo() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [standaloneDate, setStandaloneDate] = useState<Date | undefined>(
    new Date(),
  );

  const methods = useForm<FormData>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const { handleSubmit, watch, reset } = methods;
  const watchedValues = watch();

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    alert(`Form Data: ${JSON.stringify(data, null, 2)}`);
  };

  const handleStandaloneChange = (date: Date | undefined) => {
    setStandaloneDate(date);
    console.log('Standalone date changed:', date);
  };

  // Example inactive dates function (e.g., disable weekends)
  const inactiveDates = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Disable Sundays and Saturdays
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">DateSelectorField Demo</h1>
          <p className="text-muted-foreground">
            Interactive examples of the DateSelectorField component from
            @rumsan/ui
          </p>
        </div>
        <Badge variant="secondary">@rumsan/ui</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Component Controls</CardTitle>
            <CardDescription>
              Toggle different states of the component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="disabled"
                checked={isDisabled}
                onCheckedChange={setIsDisabled}
              />
              <Label htmlFor="disabled">Disabled</Label>
            </div>
            <Button
              variant="outline"
              onClick={() => reset()}
              className="w-full"
            >
              Reset Form
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Values</CardTitle>
            <CardDescription>Watch form values in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Start Date:</strong>{' '}
                {watchedValues.startDate
                  ? watchedValues.startDate.toDateString()
                  : 'Not selected'}
              </div>
              <div>
                <strong>End Date:</strong>{' '}
                {watchedValues.endDate
                  ? watchedValues.endDate.toDateString()
                  : 'Not selected'}
              </div>
              <Separator />
              <div>
                <strong>Standalone Date:</strong>{' '}
                {standaloneDate
                  ? standaloneDate.toDateString()
                  : 'Not selected'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="form-controlled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form-controlled">Form Controlled</TabsTrigger>
          <TabsTrigger value="standalone">Standalone</TabsTrigger>
        </TabsList>

        <TabsContent value="form-controlled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Controlled Example</CardTitle>
              <CardDescription>
                Using DateSelectorField with react-hook-form for validation and
                form management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <DateSelectorField
                      name="startDate"
                      label="Start Date"
                      placeholder="Select start date"
                      disabled={isDisabled}
                      inactiveDates={inactiveDates}
                    />
                    <p className="text-sm text-muted-foreground">
                      Choose the start date (weekends disabled)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <DateSelectorField
                      name="endDate"
                      label="End Date"
                      placeholder="Select end date"
                      disabled={isDisabled}
                    />
                    <p className="text-sm text-muted-foreground">
                      Choose the end date
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Submit Form
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => reset()}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standalone" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Standalone Example</CardTitle>
              <CardDescription>
                Using DateSelectorField without form context for simple use
                cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Event Date</Label>
                <DateSelectorField
                  name="eventDate"
                  label="Event Date"
                  placeholder="Pick an event date"
                  disabled={isDisabled}
                  value={standaloneDate}
                  onChange={handleStandaloneChange}
                  inactiveDates={inactiveDates}
                />
                <p className="text-sm text-muted-foreground">
                  This field operates independently without form context
                </p>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Current Value:</strong>{' '}
                  {standaloneDate
                    ? standaloneDate.toDateString()
                    : 'Not selected'}
                  <br />
                  Changes are captured via the onChange callback
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Different Configurations</CardTitle>
              <CardDescription>
                Various configurations of the DateSelectorField component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Disabled Field</Label>
                  <DateSelectorField
                    name="disabledDate"
                    label="Disabled Date"
                    disabled={true}
                    value={new Date()}
                  />
                  <p className="text-xs text-muted-foreground">
                    This field is disabled
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>With Inactive Dates</Label>
                  <DateSelectorField
                    name="inactiveDate"
                    label="Inactive Date"
                    placeholder="Select a date"
                    inactiveDates={inactiveDates}
                  />
                  <p className="text-xs text-muted-foreground">
                    Weekends are disabled
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>No Label</Label>
                  <DateSelectorField
                    name="noLabelDate"
                    placeholder="Pick a date"
                  />
                  <p className="text-xs text-muted-foreground">
                    Field without a label
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>With Change Handler</Label>
                  <DateSelectorField
                    name="handlerDate"
                    label="Handler Date"
                    placeholder="Select date"
                    onChange={(date: Date | undefined) => {
                      console.log('Date changed:', date);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Check console for change events
                  </p>
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
            Code snippets showing how to use the component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Usage</TabsTrigger>
              <TabsTrigger value="form">With Form</TabsTrigger>
              <TabsTrigger value="standalone">Standalone</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <CodeSnippet
                code={`import { DateSelectorField } from "@rumsan/ui";

<DateSelectorField
  name="date"
  label="Select Date"
  placeholder="Pick a date"
/>`}
                snippetId="basic"
              />
            </TabsContent>

            <TabsContent value="form">
              <CodeSnippet
                code={`import { useForm, FormProvider } from "react-hook-form";
import { DateSelectorField } from "@rumsan/ui";

const methods = useForm({
  defaultValues: {
    date: new Date()
  }
});

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <DateSelectorField
      name="date"
      label="Date"
      disabled={false}
    />
  </form>
</FormProvider>`}
                snippetId="form"
              />
            </TabsContent>

            <TabsContent value="standalone">
              <CodeSnippet
                code={`import { DateSelectorField } from "@rumsan/ui";

const [date, setDate] = useState<Date | undefined>(new Date());

<DateSelectorField
  name="date"
  label="Date"
  value={date}
  onChange={(newDate) => {
    setDate(newDate);
    console.log("Date changed:", newDate);
  }}
/>`}
                snippetId="standalone"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
