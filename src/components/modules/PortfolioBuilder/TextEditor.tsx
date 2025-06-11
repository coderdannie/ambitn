'use client';

import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { forwardRef } from 'react';

interface TextEditorProps {
  textContent: string;
  setTextContent: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  (
    {
      textContent,
      setTextContent,
      onSave,
      onCancel,
      placeholder = 'Write your new content here...',
      autoFocus = true,
    },
    ref
  ) => {
    return (
      <div ref={ref} className="bg-white rounded-lg p-4 border shadow-sm mb-2">
        <RichTextEditor
          value={textContent}
          onChange={setTextContent}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="max-w-none"
        />
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!textContent.trim() || textContent === '<p></p>'}
          >
            Add Text
          </Button>
        </div>
      </div>
    );
  }
);

TextEditor.displayName = 'TextEditor';

export default TextEditor;
