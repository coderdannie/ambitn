// editor-components.tsx
import { Editor } from "@tiptap/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Type } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

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
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`flex items-center gap-1 ${className}`}>{children}</div>;

export const SelectDropdown = ({
  options,
  value,
  onSelect,
  width = "w-full",
  showFontPreview = false,
}: {
  options: Array<{ value: string; label: string; [key: string]: any }>;
  value: string;
  onSelect: (value: string) => void;
  width?: string;
  showFontPreview?: boolean;
}) => (
  <Select value={value} onValueChange={onSelect}>
    <SelectTrigger className={`${width} border-0`}>
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
  const currentColor = editor.getAttributes("textStyle").color || "#000000";
  const [color, setColor] = useState(currentColor);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColor(editor.getAttributes("textStyle").color || "#000000");
  }, [editor.getAttributes("textStyle").color]);

  // Handle clicks outside the entire popover
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener with a slight delay to avoid immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={() => {}}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-col items-center">
            <Type className="w-4 h-4" />
            <div
              className="w-4 h-1 mt-0.5 rounded-sm border border-gray-300"
              style={{ backgroundColor: currentColor }}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        className="p-3 w-[220px]"
        align="start"
        onPointerDownOutside={(e) => {
          // Prevent all automatic closing
          e.preventDefault();
        }}
      >
        <HexColorPicker
          color={color}
          onChange={(newColor) => {
            setColor(newColor);
            editor.chain().focus().setColor(newColor).run();
          }}
          style={{ width: "100%" }}
        />
        <div className="flex justify-between mt-3">
          <span className="text-xs text-gray-500">{color}</span>
          <button
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setColor("#000000");
              setIsOpen(false);
            }}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Reset
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
