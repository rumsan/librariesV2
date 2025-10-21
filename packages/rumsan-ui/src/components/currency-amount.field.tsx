import React from 'react';
import { Control, FieldValues, useFormContext } from 'react-hook-form';
import { FormField } from '@rumsan/shadcn/components/form';
import { Input } from '@rumsan/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn/components/select';

interface MonetaryValueFieldProps {
  currencyName: string;
  amountName: string;
  disabled?: boolean;
  disableCurrency?: boolean;
  control?: Control<any>;
  defaultCurrency?: string;
  defaultAmount?: string;
  currencies?: string[];
  onChange?: (value: { currency: string; amount: string }) => void;
}

export const CurrencyAmountField: React.FC<MonetaryValueFieldProps> = ({
  currencyName,
  amountName,
  disabled,
  disableCurrency,
  control: controlProp,
  defaultCurrency,
  defaultAmount,
  currencies = ['NPR', 'USD', 'GBP'],
  onChange: onChangeProp,
}): React.JSX.Element => {
  const formContext = useFormContext<FieldValues>();
  const [localCurrency, setLocalCurrency] = React.useState<string>(
    defaultCurrency || '',
  );
  const [localAmount, setLocalAmount] = React.useState<string>(
    defaultAmount || '',
  );

  // Determine if we're using form control or local state
  const isFormControlled = formContext || controlProp;
  const formControl = controlProp || formContext?.control;

  // Handle local state when not form controlled
  const handleLocalChange = (type: 'currency' | 'amount', value: string) => {
    if (type === 'currency') {
      setLocalCurrency(value);
    } else {
      setLocalAmount(value);
    }

    if (onChangeProp) {
      onChangeProp({
        currency: type === 'currency' ? value : localCurrency,
        amount: type === 'amount' ? value : localAmount,
      });
    }
  };

  // Validate amount for both form controlled and local state
  const validateAmount = (amount: string): boolean => {
    return amount !== '' && Number(amount) > 0;
  };

  // If we're using form control, render the form fields
  if (isFormControlled && formControl) {
    return (
      <div className="flex w-full border rounded-md overflow-hidden">
        {/* Currency Select */}
        <FormField
          control={formControl as unknown as any}
          name={currencyName}
          render={({ field }) => (
            <div className="w-[120px]">
              <Select
                value={field.value ?? ''}
                onValueChange={field.onChange}
                disabled={disableCurrency || disabled}
              >
                <SelectTrigger className="rounded-none border-0 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
        {/* Amount Input */}
        <FormField
          control={formControl as unknown as any}
          name={amountName}
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <div className="flex-1 border-l">
              <Input
                className="rounded-none border-0 text-right w-full focus:ring-0 focus:ring-offset-0"
                type="number"
                disabled={disabled}
                {...fieldProps}
                value={value ?? 0}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const newValue =
                    e.target.value === '' ? 0 : parseFloat(e.target.value);
                  onChange(newValue);
                }}
              />
            </div>
          )}
        />
      </div>
    );
  }

  // Fallback for when used outside a form context
  return (
    <div className="flex w-full border rounded-md overflow-hidden">
      {/* Currency Select */}
      <div className="w-[120px]">
        <Select
          value={localCurrency}
          onValueChange={(value) => handleLocalChange('currency', value)}
          disabled={disableCurrency || disabled}
        >
          <SelectTrigger className="rounded-none border-0 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Amount Input */}
      <div className="flex-1 border-l">
        <Input
          className="rounded-none border-0 text-right focus:ring-0 focus:ring-offset-0"
          type="number"
          value={localAmount}
          onChange={(e) => handleLocalChange('amount', e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
