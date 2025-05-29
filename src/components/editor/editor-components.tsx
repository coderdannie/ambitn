// editor-components.tsx
import { Editor } from '@tiptap/core';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Type } from 'lucide-react';
import { TEXT_COLORS } from './editor-config';

export const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

export const ToolbarButton = ({
  onClick,
  active,
  disabled,
  title,
  icon: Icon,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Toggle
    size="sm"
    pressed={active}
    onPressedChange={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
  >
    <Icon className="w-4 h-4" />
  </Toggle>
);

export const ToolbarSection = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`flex items-center gap-1 ${className}`}>{children}</div>;

export const SelectDropdown = ({
  options,
  value,
  onSelect,
  width = 'w-full',
  showFontPreview = false,
}: {
  options: Array<{ value: string; label: string; [key: string]: any }>;
  value: string;
  onSelect: (value: string) => void;
  width?: string;
  showFontPreview?: boolean;
}) => (
  <Select value={value} onValueChange={onSelect}>
    <SelectTrigger className={width}>
      <SelectValue placeholder="Select option" />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
          style={showFontPreview ? { fontFamily: option.value } : {}}
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const ColorPicker = ({ editor }: { editor: Editor }) => {
  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded">
          <div className="flex flex-col items-center">
            <Type className="w-4 h-4" />
            <div
              className="w-4 h-1 mt-0.5 rounded-sm border border-gray-300"
              style={{ backgroundColor: currentColor }}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-8 gap-1 mb-2">
          {TEXT_COLORS.map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().setColor(color).run();
              }}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editor.chain().focus().unsetColor().run();
          }}
        >
          Remove Color
        </Button>
      </PopoverContent>
    </Popover>
  );
};
