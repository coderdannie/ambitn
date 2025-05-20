'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Unlink,
  ChevronDown,
} from 'lucide-react';

// Import Shadcn components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

// Import Quill CSS
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  autoFocus,
}) => {
  const quillRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setEditorReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Function to get Quill instance
  const getQuill = () => {
    if (!quillRef.current) return null;
    return quillRef.current.getEditor();
  };

  // Format functions
  const formatText = (format: string, value?: any) => {
    const quill = getQuill();
    if (!quill) return;

    quill.focus();
    const selection = quill.getSelection();
    if (selection) {
      // Special handling for size to set default
      if (format === 'size' && value === undefined) {
        quill.format('size', '20px');
        return;
      }

      if (value !== undefined) {
        quill.format(format, value);
      } else {
        const currentFormat = quill.getFormat(selection);
        quill.format(format, !currentFormat[format]);
      }
    }
  };

  // Insert link
  const insertLink = () => {
    const quill = getQuill();
    if (!quill) return;

    const selection = quill.getSelection();
    if (selection) {
      const url = prompt('Enter URL:', 'https://');
      if (url) {
        quill.format('link', url);
      }
    }
  };

  // Remove link
  const removeLink = () => {
    const quill = getQuill();
    if (!quill) return;

    const selection = quill.getSelection();
    if (selection) {
      quill.format('link', false);
    }
  };

  // Set paragraph style (header, blockquote, etc.)
  const setParagraphStyle = (style: string) => {
    const quill = getQuill();
    if (!quill) return;

    switch (style) {
      case 'normal':
        formatText('header', false);
        formatText('blockquote', false);
        formatText('code-block', false);
        break;
      case 'h1':
        formatText('header', 1);
        break;
      case 'h2':
        formatText('header', 2);
        break;
      case 'quote':
        formatText('blockquote', true);
        break;
      case 'code':
        formatText('code-block', true);
        break;
    }
  };

  // Set font family
  const setFontFamily = (font: string) => {
    formatText('font', font);
  };

  // Set font size
  const setFontSize = (size: string) => {
    const quill = getQuill();
    if (!quill) return;

    // Remove any existing size format first
    quill.format('size', false);

    // Apply the new size
    quill.format('size', size);

    // Focus the editor
    quill.focus();
  };

  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
    size: [
      '10px',
      '12px',
      '14px',
      '16px',
      '18px',
      '20px',
      '24px',
      '28px',
      '32px',
    ],
    keyboard: {
      bindings: {
        list: {
          key: 'Enter',
          handler: () => true,
        },
      },
    },
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'indent',
    'link',
    'image',
    'align',
    'color',
    'background',
    'code',
    'code-block',
    'script',
  ];

  return (
    <div className="rich-text-editor border rounded-md overflow-hidden">
      {/* Custom Toolbar */}
      <div
        id="toolbar"
        className="flex items-center bg-black text-white px-3 py-2 rounded-t-md overflow-x-auto sticky top-0 z-50 gap-1"
      >
        {/* Paragraph Style Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center px-3 py-1 hover:bg-gray-700 rounded">
            <span className="mr-1 text-sm">Paragraph</span>
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black dropdown-menu-content">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setParagraphStyle('normal');
              }}
            >
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setParagraphStyle('h1');
              }}
            >
              Header
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setParagraphStyle('h2');
              }}
            >
              Subheader
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setParagraphStyle('quote');
              }}
            >
              Quote
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setParagraphStyle('code');
              }}
            >
              Code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center px-3 py-1 hover:bg-gray-700 rounded ml-2">
            <span className="mr-1 text-sm">Font</span>
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black dropdown-menu-content">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontFamily('Arial');
              }}
            >
              Arial
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontFamily('Helvetica');
              }}
            >
              Helvetica
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontFamily('Times New Roman');
              }}
            >
              Times New Roman
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontFamily('Courier New');
              }}
            >
              Courier New
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontFamily('Georgia');
              }}
            >
              Georgia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center px-3 py-1 hover:bg-gray-700 rounded ml-2">
            <span className="mr-1 text-sm">Size</span>
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black dropdown-menu-content">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontSize('12px');
              }}
              className="text-xs"
            >
              12px
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontSize('14px');
              }}
              className="text-sm"
            >
              14px
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontSize('16px');
              }}
              className="text-base"
            >
              16px
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontSize('18px');
              }}
              className="text-lg"
            >
              18px
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontSize('20px');
              }}
              className="text-xl"
            >
              20px (Default)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontSize('24px');
              }}
              className="text-2xl"
            >
              24px
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontSize('28px');
              }}
              className="text-3xl"
            >
              28px
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFontSize('32px');
              }}
              className="text-4xl"
            >
              32px
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-gray-500"></div>

        {/* Text formatting */}
        <button
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => formatText('bold')}
        >
          <Bold size={18} />
        </button>
        <button
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => formatText('italic')}
        >
          <Italic size={18} />
        </button>
        <button
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => formatText('underline')}
        >
          <Underline size={18} />
        </button>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-gray-500"></div>

        {/* Alignment */}
        <button
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => formatText('align', '')}
        >
          <AlignLeft size={18} />
        </button>
        <button
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => formatText('align', 'center')}
        >
          <AlignCenter size={18} />
        </button>
        <button
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => formatText('align', 'right')}
        >
          <AlignRight size={18} />
        </button>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-gray-500"></div>

        {/* Link tools */}
        <button className="p-1 hover:bg-gray-700 rounded" onClick={insertLink}>
          <Link size={18} />
        </button>
        <button className="p-1 hover:bg-gray-700 rounded" onClick={removeLink}>
          <Unlink size={18} />
        </button>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-gray-500"></div>

        {/* Code tools */}
        <button
          className="p-1 hover:bg-gray-700 rounded text-sm"
          onClick={() => formatText('script', 'sub')}
        >
          T<sub>x</sub>
        </button>
        <button
          className="p-1 hover:bg-gray-700 rounded text-sm"
          onClick={() => formatText('code', true)}
        >
          <span className="font-mono">{'<>'}</span>
        </button>
      </div>

      {/* Quill Editor */}
      {mounted && editorReady && (
        <div>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="bg-white"
            onFocus={() => {
              if (autoFocus && quillRef.current) {
                const quill = quillRef.current.getEditor();
                quill.focus();
              }
            }}
          />
        </div>
      )}

      <style jsx global>{`
        /* Completely hide the default Quill toolbar */
        .rich-text-editor .ql-toolbar.ql-snow {
          display: none !important;
        }

        /* Style our custom toolbar with high specificity */
        .rich-text-editor #toolbar {
          display: flex !important;
          flex-wrap: wrap;
          gap: 2px !important;
          padding: 4px !important;
          background-color: black !important;
          color: white !important;
          border: none !important;
        }

        .rich-text-editor #toolbar > * {
          flex-shrink: 0 !important;
        }

        .rich-text-editor #toolbar button,
        .rich-text-editor #toolbar .dropdown-menu-trigger {
          padding: 6px 10px !important;
          margin: 0 !important;
          font-size: 0.875rem !important;
          background: transparent !important;
          color: white !important;
          border: none !important;
          cursor: pointer !important;
        }

        .rich-text-editor #toolbar .dropdown-menu-trigger > span {
          font-size: inherit !important;
        }

        .rich-text-editor #toolbar .divider {
          margin: 0 8px !important;
        }

        /* Ensure Quill container styles */
        .rich-text-editor .ql-container.ql-snow {
          border: none !important;
          min-height: 200px !important;
          height: auto !important;
        }

        .rich-text-editor .ql-editor {
          min-height: 200px !important;
          max-height: 400px !important;
          overflow-y: auto !important;
          padding: 12px 15px !important;
        }

        /* Fix for dropdown menus */
        .rich-text-editor .dropdown-menu-content {
          z-index: 1000 !important;
        }
        /* Set default font size for the editor */
        .rich-text-editor .ql-editor {
          font-size: 20px !important;
        }

        /* Style for different font sizes in the editor */
        .rich-text-editor .ql-size-10px {
          font-size: 10px !important;
        }
        .rich-text-editor .ql-size-12px {
          font-size: 12px !important;
        }
        .rich-text-editor .ql-size-14px {
          font-size: 14px !important;
        }
        .rich-text-editor .ql-size-16px {
          font-size: 16px !important;
        }
        .rich-text-editor .ql-size-18px {
          font-size: 18px !important;
        }
        .rich-text-editor .ql-size-20px {
          font-size: 20px !important;
        }
        .rich-text-editor .ql-size-24px {
          font-size: 24px !important;
        }
        .rich-text-editor .ql-size-28px {
          font-size: 28px !important;
        }
        .rich-text-editor .ql-size-32px {
          font-size: 32px !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
