import React, { ReactNode } from 'react';
import { Control, FieldValues, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumsan/shadcn/components/form';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  children: ReactNode;
  disabled?: boolean;
  control?: Control<any>;
  value?: any;
  onChange?: (value: any) => void;
};

export const StandardFormField = ({
  name,
  label,
  placeholder,
  children,
  disabled,
  control: controlProp,
  value,
  onChange,
}: Props) => {
  const formContext = useFormContext<FieldValues>();
  const [localValue, setLocalValue] = React.useState<any>(value);

  // Determine if we're using form control or local state
  const isFormControlled = formContext || controlProp;
  const formControl = controlProp || formContext?.control;

  // Handle local state when not form controlled
  const handleLocalChange = (newValue: any) => {
    setLocalValue(newValue);
    if (onChange) onChange(newValue);
  };

  // If we're using form control, render the form field
  if (isFormControlled && formControl) {
    return (
      <FormField
        control={formControl as unknown as any}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {React.cloneElement(children as React.ReactElement, {
                ...field,
                ...(children && 'placeholder' in (children as any).props
                  ? { placeholder }
                  : {}),
                ...(children && 'disabled' in (children as any).props
                  ? { disabled }
                  : {}),
              })}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Fallback for when used outside a form context
  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            value: localValue,
            onChange: (e: any) => {
              const newValue =
                e?.target?.value !== undefined ? e.target.value : e;
              handleLocalChange(newValue);
            },
            placeholder,
            disabled,
          })
        : children}
    </div>
  );
};
