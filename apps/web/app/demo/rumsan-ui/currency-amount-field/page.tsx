'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CurrencyAmountField } from '@rumsan/ui/components/currency-amount.field';
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
  paymentCurrency: string;
  paymentAmount: number;
  budgetCurrency: string;
  budgetAmount: number;
}

export default function CurrencyAmountFieldDemo() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [disableCurrency, setDisableCurrency] = useState(false);
  const [standaloneValue, setStandaloneValue] = useState({
    currency: 'USD',
    amount: '100',
  });

  const methods = useForm<FormData>({
    defaultValues: {
      paymentCurrency: 'NPR',
      paymentAmount: 0,
      budgetCurrency: 'USD',
      budgetAmount: 500,
    },
  });

  const { handleSubmit, watch, reset } = methods;
  const watchedValues = watch();

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    alert(`Form Data: ${JSON.stringify(data, null, 2)}`);
  };

  const handleStandaloneChange = (value: {
    currency: string;
    amount: string;
  }) => {
    setStandaloneValue(value);
    console.log('Standalone value changed:', value);
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CurrencyAmountField Demo</h1>
          <p className="text-muted-foreground">
            Interactive examples of the CurrencyAmountField component from
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
            <div className="flex items-center space-x-2">
              <Switch
                id="disable-currency"
                checked={disableCurrency}
                onCheckedChange={setDisableCurrency}
              />
              <Label htmlFor="disable-currency">
                Disable Currency Selection
              </Label>
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
                <strong>Payment:</strong> {watchedValues.paymentAmount}{' '}
                {watchedValues.paymentCurrency}
              </div>
              <div>
                <strong>Budget:</strong> {watchedValues.budgetAmount}{' '}
                {watchedValues.budgetCurrency}
              </div>
              <Separator />
              <div>
                <strong>Standalone:</strong> {standaloneValue.amount}{' '}
                {standaloneValue.currency}
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
                Using CurrencyAmountField with react-hook-form for validation
                and form management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Payment Amount</Label>
                    <CurrencyAmountField
                      currencyName="paymentCurrency"
                      amountName="paymentAmount"
                      disabled={isDisabled}
                      disableCurrency={disableCurrency}
                      defaultCurrency="NPR"
                      defaultAmount="0"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the payment amount with currency selection
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Budget Amount</Label>
                    <CurrencyAmountField
                      currencyName="budgetCurrency"
                      amountName="budgetAmount"
                      disabled={isDisabled}
                      disableCurrency={disableCurrency}
                      defaultCurrency="USD"
                      defaultAmount="500"
                    />
                    <p className="text-sm text-muted-foreground">
                      Set your budget with automatic currency conversion
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
                Using CurrencyAmountField without form context for simple use
                cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Transaction Amount</Label>
                <CurrencyAmountField
                  currencyName="currency"
                  currencies={['USD', 'NPR', 'EUR', 'GBP', 'JPY']}
                  amountName="amount"
                  disabled={isDisabled}
                  disableCurrency={disableCurrency}
                  defaultCurrency="USD"
                  defaultAmount="100"
                  onChange={handleStandaloneChange}
                />
                <p className="text-sm text-muted-foreground">
                  This field operates independently without form context
                </p>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Current Value:</strong> {standaloneValue.amount}{' '}
                  {standaloneValue.currency}
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
                Various configurations of the CurrencyAmountField component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Currency Disabled</Label>
                  <CurrencyAmountField
                    currencyName="fixedCurrency"
                    amountName="fixedAmount"
                    disableCurrency={true}
                    defaultCurrency="NPR"
                    defaultAmount="1000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Fixed currency, only amount can be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Fully Disabled</Label>
                  <CurrencyAmountField
                    currencyName="disabledCurrency"
                    amountName="disabledAmount"
                    disabled={true}
                    defaultCurrency="GBP"
                    defaultAmount="250"
                  />
                  <p className="text-xs text-muted-foreground">
                    Both currency and amount are disabled
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Empty Defaults</Label>
                  <CurrencyAmountField
                    currencyName="emptyCurrency"
                    amountName="emptyAmount"
                  />
                  <p className="text-xs text-muted-foreground">
                    No default values provided
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>With Change Handler</Label>
                  <CurrencyAmountField
                    currencyName="handlerCurrency"
                    amountName="handlerAmount"
                    defaultCurrency="USD"
                    defaultAmount="75"
                    onChange={(value: { currency: string; amount: string }) => {
                      console.log('Value changed:', value);
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
                code={`import { CurrencyAmountField } from "@rumsan/ui";

<CurrencyAmountField
  currencyName="currency"
  amountName="amount"
  defaultCurrency="USD"
  defaultAmount="100"
/>`}
                snippetId="basic"
              />
            </TabsContent>

            <TabsContent value="form">
              <CodeSnippet
                code={`import { useForm, FormProvider } from "react-hook-form";
import { CurrencyAmountField } from "@rumsan/ui";

const methods = useForm({
  defaultValues: {
    currency: "NPR",
    amount: 0
  }
});

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <CurrencyAmountField
      currencyName="currency"
      amountName="amount"
      disabled={false}
      disableCurrency={false}
    />
  </form>
</FormProvider>`}
                snippetId="form"
              />
            </TabsContent>

            <TabsContent value="standalone">
              <CodeSnippet
                code={`import { CurrencyAmountField } from "@rumsan/ui";

const [value, setValue] = useState({ currency: "USD", amount: "0" });

<CurrencyAmountField
  currencyName="currency"
  amountName="amount"
  defaultCurrency="USD"
  defaultAmount="100"
  onChange={(newValue) => {
    setValue(newValue);
    console.log("Changed:", newValue);
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
