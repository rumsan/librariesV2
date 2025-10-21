import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { Control, FieldValues, useFormContext } from 'react-hook-form';
import { Button } from '@rumsan/shadcn/components/button';
import { Calendar } from '@rumsan/shadcn/components/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumsan/shadcn/components/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rumsan/shadcn/components/popover';

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  inactiveDates?: (date: Date) => boolean;
  disabled?: boolean;
  control?: Control<any>;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
};

export const DateSelectorField = ({
  name,
  label = 'Date',
  placeholder = 'Pick a date',
  inactiveDates = () => false,
  disabled = false,
  control: controlProp,
  value: valueProp,
  onChange: onChangeProp,
}: Props): React.JSX.Element => {
  const formContext = useFormContext<FieldValues>();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [localDate, setLocalDate] = React.useState<Date | undefined>(valueProp);

  // Determine if we're using form control or local state
  const isFormControlled = formContext || controlProp;
  const formControl = controlProp || formContext?.control;

  // Handle local state when not form controlled
  const handleDateChange = (date: Date | undefined) => {
    if (onChangeProp) onChangeProp(date);
    if (!isFormControlled) setLocalDate(date);
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
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={disabled || field.disabled}
                    variant="outline"
                    className={`w-full pl-3 text-left font-normal ${
                      !field.value && 'text-muted-foreground'
                    }`}
                  >
                    {field.value ? (
                      format(new Date(field.value), 'PPP')
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    setIsPopoverOpen(false);
                  }}
                  disabled={inactiveDates}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            className={`w-full pl-3 text-left font-normal ${
              !localDate && 'text-muted-foreground'
            }`}
          >
            {localDate ? format(localDate, 'PPP') : <span>{placeholder}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={localDate}
            onSelect={(date) => {
              handleDateChange(date);
              setIsPopoverOpen(false);
            }}
            disabled={inactiveDates}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
