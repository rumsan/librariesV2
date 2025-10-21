import { XCircle } from 'lucide-react';
import React from 'react';
import { Control, FieldValues, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rumsan/shadcn/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn/components/select';

interface SelectFieldProps {
  name: string;
  disabled?: boolean;
  selectOptions?: { label: string; value: string }[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  value?: string;
  control?: Control<any>;
}

const SelectField = React.forwardRef<HTMLInputElement, SelectFieldProps>(
  (props, ref) => {
    const formContext = useFormContext<FieldValues>();
    const [localValue, setLocalValue] = React.useState<string>(
      props.value || '',
    );

    let {
      name,
      disabled = false,
      selectOptions = [],
      placeholder = 'Select an item',
      onValueChange,
      onClear,
      showClearButton = true,
      control: controlProp,
    } = props;

    // Determine if we're using form control or local state
    const isFormControlled = formContext || controlProp;
    const formControl = controlProp || formContext?.control;

    if (isFormControlled && !name) {
      throw new Error('SelectField: name is required when used in a form');
    }

    // Handle local state when not form controlled
    const handleLocalChange = (value: string) => {
      setLocalValue(value);
      if (onValueChange) onValueChange(value);
    };

    const handleClearValue = () => {
      if (onClear) onClear();
      if (isFormControlled) {
        // Will be handled by the form field
      } else {
        setLocalValue('');
        if (onValueChange) onValueChange('');
      }
    };

    // If we're using form control, render the form field
    if (isFormControlled && formControl && name) {
      return (
        <FormField
          control={formControl as unknown as any}
          name={name}
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <FormControl>
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (onValueChange) onValueChange(value);
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={`${
                        showClearButton && field.value && !disabled
                          ? 'relative pr-8 flex items-center'
                          : ''
                      }`}
                    >
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectOptions
                        .filter((item) => item.value.trim() !== '')
                        .map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {/* Clear button */}
                {showClearButton && field.value && !disabled && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onClear) onClear();
                      field.onChange('');
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label="Clear selection"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    // Fallback for when used outside a form context
    return (
      <div className="relative">
        <Select
          value={localValue}
          onValueChange={handleLocalChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={`${
              showClearButton && localValue && !disabled
                ? 'relative pr-8 flex items-center'
                : ''
            }`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions
              .filter((item) => item.value.trim() !== '')
              .map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {/* Clear button */}
        {showClearButton && localValue && !disabled && (
          <button
            type="button"
            onClick={handleClearValue}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            aria-label="Clear selection"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
export { SelectField };
