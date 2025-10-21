import { Pencil } from 'lucide-react';
import React from 'react';
import { Input } from '@rumsan/shadcn/components/input';
import { Label } from '@rumsan/shadcn/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn/components/select';

interface BaseEditableFieldProps {
  label?: string;
  value: string | number;
  onSave: (value: string) => void;
  className?: string;
}

interface EditableTextFieldProps extends BaseEditableFieldProps {
  type?: 'text' | 'number';
}

interface EditableSelectFieldProps extends BaseEditableFieldProps {
  options: Array<{
    label: string;
    value: string;
  }>;
}

export function EditableTextField({
  label,
  value,
  onSave,
  type = 'text',
  className = '',
}: EditableTextFieldProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value.toString());

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  return (
    <div className={`group relative ${className}`}>
      {label && (
        <Label className="text-xs font-normal text-gray-400">{label}</Label>
      )}
      {!isEditing ? (
        <div
          onClick={() => setIsEditing(true)}
          className="text-black font-normal text-sm flex items-center group-hover:border-dotted group-hover:border group-hover:border-gray-400 group-hover:rounded p-1 cursor-pointer relative"
        >
          {value}
          <Pencil className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 absolute right-2" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-7 text-sm"
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

export function EditableSelectField({
  label,
  value,
  options,
  onSave,
  className = '',
}: EditableSelectFieldProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const currentOption = options.find((opt) => opt.value === value);

  const handleSave = (newValue: string) => {
    onSave(newValue);
    setIsEditing(false);
  };

  return (
    <div className={`group relative ${className}`}>
      {label && (
        <Label className="text-xs font-normal text-gray-400">{label}</Label>
      )}
      {!isEditing ? (
        <div
          onClick={() => setIsEditing(true)}
          className="text-black font-normal text-sm flex items-center group-hover:border-dotted group-hover:border group-hover:border-gray-400 group-hover:rounded p-1 cursor-pointer relative"
        >
          {currentOption?.label || value}
          <Pencil className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 absolute right-2" />
        </div>
      ) : (
        <Select
          value={value.toString()}
          onValueChange={handleSave}
          onOpenChange={(open) => !open && setIsEditing(false)}
        >
          <SelectTrigger className="h-7 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
