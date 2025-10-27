import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useRef } from "react";
import {
  Link2,
  Image as ImageIcon,
  Undo,
  Redo,
  List,
  ListOrdered as ListOrderedIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { extensions, editorProps } from "./editor-config";
import {
  ToolbarButton,
  ToolbarSection,
  SelectDropdown,
  ColorPicker,
  Divider,
} from "./editor-components";
import { MobileToolbar } from "./mobile-toolbar";
import {
  PARAGRAPH_STYLES,
  FONT_FAMILIES,
  FONT_SIZES,
  FORMATTING_BUTTONS,
  ALIGNMENT_OPTIONS,
} from "./editor-config";
import { FormattingButton, StyleOption } from "@/types/editor";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  minHeight?: string;
  maxHeight?: string; // Optional maximum height
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  autoFocus = false,
  className = "",
}: RichTextEditorProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions,
    content: value || "<p></p>",
    editorProps: {
      ...editorProps,
      attributes: {
        ...editorProps.attributes,
        class: "min-h-[100px]",
        "data-placeholder": placeholder,
      },
    },

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    autofocus: autoFocus,
  });

  if (!editor) return null;

  const getCurrentStyle = () => {
    const activeStyle = PARAGRAPH_STYLES.find((style: StyleOption) => {
      if ("level" in style && style.level) {
        return editor.isActive("heading", { level: style.level });
      }
      return style.value === "paragraph" && !editor.isActive("heading");
    });
    return activeStyle?.value || "paragraph";
  };

  const getCurrentFontFamily = () =>
    editor.getAttributes("textStyle").fontFamily || "Arial, sans-serif";

  const getCurrentFontSize = () =>
    editor.getAttributes("textStyle").fontSize || "14px";

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().toggleLink({ href: url }).run();
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-white  border-gray-300 overflow-hidden rounded-[8px] shadow-lg flex flex-col ${className}`}
      data-editor-container="true"
    >
      {/* Fixed Toolbar */}
      <div
        className="border-b border-gray-200 !text-gray-300 bg-gradient-to-b from-[#1A202C] to-[#441C31]  flex-shrink-0"
        data-editor-toolbar="true"
      >
        <div className="flex items-center gap-1 p-2 flex-wrap">
          {/* Text style controls */}
          <ToolbarSection className="flex">
            <SelectDropdown
              options={PARAGRAPH_STYLES}
              value={getCurrentStyle()}
              onSelect={(value) => {
                const style = PARAGRAPH_STYLES.find((s) => s.value === value);
                if (style) style.action(editor);
              }}
              width="w-22"
            />

            <Divider />

            <SelectDropdown
              options={FONT_FAMILIES}
              value={getCurrentFontFamily()}
              onSelect={(value) =>
                editor.chain().focus().setFontFamily(value).run()
              }
              width="w-22"
              showFontPreview
            />
            <Divider />
            <SelectDropdown
              options={FONT_SIZES}
              value={getCurrentFontSize()}
              onSelect={(value) =>
                editor.chain().focus().setFontSize(value).run()
              }
              width="w-20"
            />

            <Divider />
          </ToolbarSection>

          {/* Formatting buttons */}
          <ToolbarSection>
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
                title={`${button.title} (${button.shortcut})`}
                icon={button.icon}
              />
            ))}
            <ColorPicker editor={editor} />
          </ToolbarSection>

          <Divider />

          {/* Alignment */}
          <ToolbarSection className="flex">
            <ToggleGroup
              type="single"
              value={
                ALIGNMENT_OPTIONS.find((opt) =>
                  editor.isActive({ textAlign: opt.value })
                )?.value || ""
              }
              onValueChange={(value) => {
                if (value) editor.chain().focus().setTextAlign(value).run();
              }}
              className="gap-1"
            >
              {ALIGNMENT_OPTIONS.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  title={option.title}
                  aria-label={option.title}
                >
                  <option.icon className="w-4 h-4" />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </ToolbarSection>

          <Divider />

          {/* Lists */}
          <ToolbarSection className="flex">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              title="Bullet List"
              icon={List} // Replace with your bullet list icon
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="Numbered List"
              icon={ListOrderedIcon} // Replace with your numbered list icon
            />
          </ToolbarSection>

          <Divider />

          {/* Insert */}
          <ToolbarSection className="flex flex-wrap gap-1">
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
          </ToolbarSection>

          <div className="flex-1" />

          {/* Undo/Redo */}
          <ToolbarSection>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </ToolbarSection>
        </div>
      </div>

      {/* Auto-growing Content Area */}
      <div
        ref={editorRef}
        className="bg-white  duration-200 ease-in-out"
        data-editor-content="true"
      >
        <EditorContent
          editor={editor}
          className="focus-within:outline-none prose max-w-none p-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:list-item"
        />
      </div>

      <MobileToolbar
        editor={editor}
        show={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
}
