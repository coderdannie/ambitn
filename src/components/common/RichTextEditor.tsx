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
  Check,
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
import { fontSizes } from './constants';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

// Extended font families
const fontFamilies = [
  { value: 'arial', label: 'Arial', className: 'font-sans' },
  { value: 'helvetica', label: 'Helvetica', className: 'font-sans' },
  {
    value: 'times-new-roman',
    label: 'Times New Roman',
    className: 'font-serif',
  },
  { value: 'courier-new', label: 'Courier New', className: 'font-mono' },
  { value: 'georgia', label: 'Georgia', className: 'font-serif' },
  { value: 'trebuchet-ms', label: 'Trebuchet MS', className: 'font-sans' },
  { value: 'verdana', label: 'Verdana', className: 'font-sans' },
  { value: 'comic-sans-ms', label: 'Comic Sans MS', className: 'font-sans' },
  { value: 'impact', label: 'Impact', className: 'font-sans' },
  { value: 'palatino', label: 'Palatino', className: 'font-serif' },
  { value: 'garamond', label: 'Garamond', className: 'font-serif' },
  { value: 'bookman', label: 'Bookman', className: 'font-serif' },
  { value: 'tahoma', label: 'Tahoma', className: 'font-sans' },
  { value: 'lucida-console', label: 'Lucida Console', className: 'font-mono' },
  { value: 'monaco', label: 'Monaco', className: 'font-mono' },
];

// Paragraph styles
const paragraphStyles = [
  { value: 'normal', label: 'Paragraph' },
  { value: 'h1', label: 'Header' },
  { value: 'h2', label: 'Subheader' },
  { value: 'quote', label: 'Quote' },
  { value: 'code', label: 'Code' },
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  autoFocus,
}) => {
  const quillRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [currentSize, setCurrentSize] = useState('16px');
  const [currentFont, setCurrentFont] = useState('Arial');
  const [currentParagraphStyle, setCurrentParagraphStyle] = useState('normal');
  const [formatStates, setFormatStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: '',
  });

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setEditorReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Initialize custom sizes and fonts for Quill
  useEffect(() => {
    if (mounted && editorReady && typeof window !== 'undefined') {
      const Quill = require('react-quill-new').Quill;

      // Register font size
      const Size = Quill.import('attributors/style/size');
      Size.whitelist = fontSizes;
      Quill.register(Size, true);

      // Register font family
      const Font = Quill.import('formats/font');
      Font.whitelist = fontFamilies.map((font) => font.value);
      Quill.register(Font, true);

      // Set up listeners for format changes
      const quill = getQuill();
      if (quill) {
        quill.on('editor-change', () => {
          const selection = quill.getSelection();
          if (selection) {
            const formats = quill.getFormat(selection);

            // Update current font
            if (formats.font) {
              const fontFamily = fontFamilies.find(
                (f) => f.value === formats.font
              );
              setCurrentFont(fontFamily ? fontFamily.label : 'Arial');
            } else {
              setCurrentFont('Arial');
            }

            // Update current size
            if (formats.size) {
              setCurrentSize(formats.size);
            } else {
              setCurrentSize('16px');
            }

            // Update paragraph style
            if (formats.header === 1) {
              setCurrentParagraphStyle('h1');
            } else if (formats.header === 2) {
              setCurrentParagraphStyle('h2');
            } else if (formats.blockquote) {
              setCurrentParagraphStyle('quote');
            } else if (formats['code-block']) {
              setCurrentParagraphStyle('code');
            } else {
              setCurrentParagraphStyle('normal');
            }

            // Update format states
            setFormatStates({
              bold: !!formats.bold,
              italic: !!formats.italic,
              underline: !!formats.underline,
              align: formats.align || 'left',
            });
          }
        });
      }
    }
  }, [mounted, editorReady]);

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
    const quill = getQuill();
    if (!quill) return;

    quill.format('font', font);
    quill.focus();
  };

  // Set alignment
  const setAlignment = (align: string) => {
    const quill = getQuill();
    if (!quill) return;

    const selection = quill.getSelection();
    if (selection) {
      // For left alignment, we set it to false to remove alignment (default)
      const alignValue = align === 'left' ? false : align;
      quill.formatLine(
        selection.index,
        selection.length || 1,
        'align',
        alignValue
      );
      quill.focus();
    }
  };

  // Set font size
  const setFontSize = (size: string) => {
    const quill = getQuill();
    if (!quill) return;

    quill.format('size', size);
    setCurrentSize(size);
    quill.focus();
  };

  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
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
            <span className="mr-1 text-sm">
              {paragraphStyles.find((p) => p.value === currentParagraphStyle)
                ?.label || 'Paragraph'}
            </span>
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black dropdown-menu-content">
            {paragraphStyles.map((style) => (
              <DropdownMenuItem
                key={style.value}
                onClick={(e) => {
                  e.stopPropagation();
                  setParagraphStyle(style.value);
                }}
                className="flex items-center justify-between"
              >
                <span>{style.label}</span>
                {currentParagraphStyle === style.value && (
                  <Check size={16} className="text-blue-600" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center px-3 py-1 hover:bg-gray-700 rounded ml-2">
            <span className="mr-1 text-sm">{currentFont}</span>
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black dropdown-menu-content max-h-80 overflow-y-auto">
            {fontFamilies.map((font) => (
              <DropdownMenuItem
                key={font.value}
                onClick={(e) => {
                  e.stopPropagation();
                  setFontFamily(font.value);
                }}
                className={`flex items-center justify-between ${font.className}`}
              >
                <span>{font.label}</span>
                {currentFont === font.label && (
                  <Check size={16} className="text-blue-600" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center px-3 py-1 hover:bg-gray-700 rounded ml-2">
            <span className="mr-1 text-sm">{currentSize}</span>
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white h-[400px] overflow-y-auto text-black dropdown-menu-content">
            {fontSizes.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setFontSize(size);
                }}
                className="flex items-center justify-between"
              >
                <span>{size}</span>
                {currentSize === size && (
                  <Check size={16} className="text-blue-600" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-gray-500"></div>

        {/* Text formatting */}
        <button
          className={`p-1 rounded ${
            formatStates.bold ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
          }`}
          onClick={() => formatText('bold')}
        >
          <Bold size={18} />
        </button>
        <button
          className={`p-1 rounded ${
            formatStates.italic ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
          }`}
          onClick={() => formatText('italic')}
        >
          <Italic size={18} />
        </button>
        <button
          className={`p-1 rounded ${
            formatStates.underline
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-700'
          }`}
          onClick={() => formatText('underline')}
        >
          <Underline size={18} />
        </button>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-gray-500"></div>

        {/* Alignment */}
        <button
          className={`p-1 rounded ${
            !formatStates.align || formatStates.align === 'left'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-700'
          }`}
          onClick={() => setAlignment('left')}
        >
          <AlignLeft size={18} />
        </button>
        <button
          className={`p-1 rounded ${
            formatStates.align === 'center'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-700'
          }`}
          onClick={() => setAlignment('center')}
        >
          <AlignCenter size={18} />
        </button>
        <button
          className={`p-1 rounded ${
            formatStates.align === 'right'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-700'
          }`}
          onClick={() => setAlignment('right')}
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

        /* Active state styles */
        .rich-text-editor #toolbar button.bg-blue-600 {
          background-color: #2563eb !important;
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
          font-size: 16px !important;
        }

        /* Fix for dropdown menus */
        .rich-text-editor .dropdown-menu-content {
          z-index: 1000 !important;
        }

        /* Font size styles */
        .ql-editor .ql-size-11px {
          font-size: 11px !important;
        }
        .ql-editor .ql-size-12px {
          font-size: 12px !important;
        }
        .ql-editor .ql-size-14px {
          font-size: 14px !important;
        }
        .ql-editor .ql-size-16px {
          font-size: 16px !important;
        }
        .ql-editor .ql-size-18px {
          font-size: 18px !important;
        }
        .ql-editor .ql-size-24px {
          font-size: 24px !important;
        }
        .ql-editor .ql-size-30px {
          font-size: 30px !important;
        }
        .ql-editor .ql-size-36px {
          font-size: 36px !important;
        }
        .ql-editor .ql-size-48px {
          font-size: 48px !important;
        }
        .ql-editor .ql-size-60px {
          font-size: 60px !important;
        }
        .ql-editor .ql-size-72px {
          font-size: 72px !important;
        }

        /* Font family styles */
        .ql-editor .ql-font-arial {
          font-family: Arial, sans-serif !important;
        }
        .ql-editor .ql-font-helvetica {
          font-family: Helvetica, sans-serif !important;
        }
        .ql-editor .ql-font-times-new-roman {
          font-family: 'Times New Roman', serif !important;
        }
        .ql-editor .ql-font-courier-new {
          font-family: 'Courier New', monospace !important;
        }
        .ql-editor .ql-font-georgia {
          font-family: Georgia, serif !important;
        }
        .ql-editor .ql-font-trebuchet-ms {
          font-family: 'Trebuchet MS', sans-serif !important;
        }
        .ql-editor .ql-font-verdana {
          font-family: Verdana, sans-serif !important;
        }
        .ql-editor .ql-font-comic-sans-ms {
          font-family: 'Comic Sans MS', cursive !important;
        }
        .ql-editor .ql-font-impact {
          font-family: Impact, sans-serif !important;
        }
        .ql-editor .ql-font-palatino {
          font-family: Palatino, serif !important;
        }
        .ql-editor .ql-font-garamond {
          font-family: Garamond, serif !important;
        }
        .ql-editor .ql-font-bookman {
          font-family: Bookman, serif !important;
        }
        .ql-editor .ql-font-tahoma {
          font-family: Tahoma, sans-serif !important;
        }
        .ql-editor .ql-font-lucida-console {
          font-family: 'Lucida Console', monospace !important;
        }
        .ql-editor .ql-font-monaco {
          font-family: Monaco, monospace !important;
        }

        /* Text Alignment Classes - Direct element targeting */
        .ql-editor p[class*='ql-align-center'],
        .ql-editor div[class*='ql-align-center'],
        .ql-editor h1[class*='ql-align-center'],
        .ql-editor h2[class*='ql-align-center'],
        .ql-editor h3[class*='ql-align-center'],
        .ql-editor blockquote[class*='ql-align-center'] {
          text-align: center !important;
        }

        .ql-editor p[class*='ql-align-right'],
        .ql-editor div[class*='ql-align-right'],
        .ql-editor h1[class*='ql-align-right'],
        .ql-editor h2[class*='ql-align-right'],
        .ql-editor h3[class*='ql-align-right'],
        .ql-editor blockquote[class*='ql-align-right'] {
          text-align: right !important;
        }

        .ql-editor p[class*='ql-align-justify'],
        .ql-editor div[class*='ql-align-justify'],
        .ql-editor h1[class*='ql-align-justify'],
        .ql-editor h2[class*='ql-align-justify'],
        .ql-editor h3[class*='ql-align-justify'],
        .ql-editor blockquote[class*='ql-align-justify'] {
          text-align: justify !important;
        }

        /* More specific selectors */
        .rich-text-editor .ql-editor p.ql-align-center {
          text-align: center !important;
        }
        .rich-text-editor .ql-editor p.ql-align-right {
          text-align: right !important;
        }
        .rich-text-editor .ql-editor p.ql-align-justify {
          text-align: justify !important;
        }
        .rich-text-editor .ql-editor h1.ql-align-center,
        .rich-text-editor .ql-editor h2.ql-align-center {
          text-align: center !important;
        }
        .rich-text-editor .ql-editor h1.ql-align-right,
        .rich-text-editor .ql-editor h2.ql-align-right {
          text-align: right !important;
        }
        .rich-text-editor .ql-editor blockquote.ql-align-center {
          text-align: center !important;
        }
        .rich-text-editor .ql-editor blockquote.ql-align-right {
          text-align: right !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
