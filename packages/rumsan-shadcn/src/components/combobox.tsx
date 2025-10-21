'use client';

import * as React from 'react';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../lib/utils';

interface ComboBoxProps {
  label?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  options: { value: string; label: string }[];
  onSelect?: (value: string) => void;
  selectedValue?: string;
  placeholder?: string;
  className?: string;
}

export function ComboBox({
  label = '',
  side = 'bottom',
  options,
  onSelect,
  selectedValue,
  placeholder = 'Select an option',
  className = '',
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState<{
    value: string;
    label: string;
  } | null>(options?.find((option) => option.value === selectedValue) || null);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('min-w-[200px] justify-between', className)}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>{placeholder}</>}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" side={side}>
          <Command>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter(
                    (option) =>
                      searchValue === '' ||
                      option.label
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()),
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        setSelectedOption(option);
                        onSelect?.(option.value);
                        setOpen(false);
                        setSearchValue('');
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
