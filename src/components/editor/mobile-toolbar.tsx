// mobile-toolbar.tsx
import {
  SelectDropdown,
  ToolbarButton,
  ColorPicker,
} from './editor-components';
import {
  PARAGRAPH_STYLES,
  FONT_FAMILIES,
  FONT_SIZES,
  FORMATTING_BUTTONS,
  ALIGNMENT_OPTIONS,
  LIST_BUTTONS,
} from './editor-config';
import { Editor } from '@tiptap/core';
import { ImageIcon, X, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import {
  AlignmentOption,
  FormattingButton,
  ListButton,
  StyleOption,
} from '@/types/editor';

export const MobileToolbar = ({
  editor,
  show,
  onClose,
}: {
  editor: Editor;
  show: boolean;
  onClose: () => void;
}) => {
  const getCurrentStyle = () => {
    const activeStyle = PARAGRAPH_STYLES.find((style: StyleOption) => {
      if ('level' in style && style.level) {
        return editor.isActive('heading', { level: style.level });
      }
      return style.value === 'paragraph' && !editor.isActive('heading');
    });
    return activeStyle?.value || 'paragraph';
  };

  const getCurrentFontFamily = () =>
    editor.getAttributes('textStyle').fontFamily || 'Arial, sans-serif';

  const getCurrentFontSize = () =>
    editor.getAttributes('textStyle').fontSize || '14px';

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) editor.chain().focus().toggleLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${
        show ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Formatting</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Text Style</h4>
          <SelectDropdown
            options={PARAGRAPH_STYLES}
            value={getCurrentStyle()}
            onSelect={(value) => {
              const style = PARAGRAPH_STYLES.find((s) => s.value === value);
              if (style) style.action(editor);
            }}
          />

          <SelectDropdown
            options={FONT_FAMILIES}
            value={getCurrentFontFamily()}
            onSelect={(value) =>
              editor.chain().focus().setFontFamily(value).run()
            }
            showFontPreview
          />

          <SelectDropdown
            options={FONT_SIZES}
            value={getCurrentFontSize()}
            onSelect={(value) =>
              editor.chain().focus().setFontSize(value).run()
            }
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Formatting</h4>
          <div className="grid grid-cols-4 gap-2">
            {(FORMATTING_BUTTONS as FormattingButton[]).map((button) => (
              <ToolbarButton
                key={button.mark}
                onClick={() =>
                  editor.chain().focus().toggleMark(button.mark).run()
                }
                active={editor.isActive(button.mark)}
                disabled={
                  !editor.can().chain().focus().toggleMark(button.mark).run()
                }
                title={button.title}
                icon={button.icon}
              />
            ))}
            <ColorPicker editor={editor} />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Alignment</h4>
          <ToggleGroup
            type="single"
            value={
              (ALIGNMENT_OPTIONS as AlignmentOption[]).find((opt) =>
                editor.isActive({ textAlign: opt.value })
              )?.value || ''
            }
            onValueChange={(value) => {
              if (value) editor.chain().focus().setTextAlign(value).run();
            }}
          >
            <div className="grid grid-cols-4 gap-2">
              {(ALIGNMENT_OPTIONS as AlignmentOption[]).map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  title={option.title}
                  aria-label={option.title}
                >
                  <option.icon className="w-4 h-4" />
                </ToggleGroupItem>
              ))}
            </div>
          </ToggleGroup>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Lists & Insert</h4>
          <div className="grid grid-cols-4 gap-2">
            {(LIST_BUTTONS as ListButton[]).map((button) => (
              <ToolbarButton
                key={button.mark}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleList(button.mark, 'listItem')
                    .run()
                }
                active={editor.isActive(button.mark)}
                title={button.title}
                icon={button.icon}
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={setLink}
              title="Insert Link"
              aria-label="Insert link"
            >
              <Link2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={addImage}
              title="Insert Image"
              aria-label="Insert image"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
