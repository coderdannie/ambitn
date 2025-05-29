// editor-config.ts
// import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import FontFamily from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import FontSize from '@tiptap/extension-font-size';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import {
  AlignmentOption,
  FormattingButton,
  ListButton,
  StyleOption,
} from '@/types/editor';

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough as StrikethroughIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Underline as UnderlineIcon,
} from 'lucide-react';

export const extensions = [
  StarterKit.configure({
    heading: false,
  }),
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
    HTMLAttributes: {
      class: 'my-heading',
    },
  }),
  Underline,
  FontFamily,
  TextStyle,
  Color,
  ListItem,
  FontSize.configure({
    types: ['textStyle'],
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-600 underline cursor-pointer',
    },
  }),
  Image,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  Placeholder.configure({ placeholder: 'Start writing your document...' }),
];

export const editorProps = {
  attributes: {
    class:
      'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6 max-w-none [&_ul]:list-disc [&_ol]:list-decimal',
  },
};

export const TEXT_COLORS: string[] = [
  '#000000',
  '#444444',
  '#666666',
  '#999999',
  '#cccccc',
  '#eeeeee',
  '#f3f3f3',
  '#ffffff',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
  '#f4cccc',
  '#fce5cd',
  '#fff2cc',
  '#d9ead3',
  '#d0e0e3',
  '#cfe2f3',
  '#d9d2e9',
  '#ead1dc',
  '#ea9999',
  '#f9cb9c',
  '#ffe599',
  '#b6d7a8',
  '#a2c4c9',
  '#9fc5e8',
  '#b4a7d6',
  '#d5a6bd',
  '#e06666',
  '#f6b26b',
  '#ffd966',
  '#93c47d',
  '#76a5af',
  '#6fa8dc',
  '#8e7cc3',
  '#c27ba0',
  '#cc0000',
  '#e69138',
  '#f1c232',
  '#6aa84f',
  '#45818e',
  '#3d85c6',
  '#674ea7',
  '#a64d79',
  '#990000',
  '#b45f06',
  '#bf9000',
  '#38761d',
  '#134f5c',
  '#0b5394',
  '#351c75',
  '#741b47',
  '#660000',
  '#783f04',
  '#7f6000',
  '#274e13',
  '#0c343d',
  '#073763',
  '#20124d',
  '#4c1130',
];

export const FONT_FAMILIES: SingleValue[] = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
];

export const FONT_SIZES: SingleValue[] = [
  { label: '8', value: '8px' },
  { label: '9', value: '9px' },
  { label: '10', value: '10px' },
  { label: '11', value: '11px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '24', value: '24px' },
  { label: '30', value: '30px' },
  { label: '36', value: '36px' },
  { label: '48', value: '48px' },
  { label: '60', value: '60px' },
  { label: '72', value: '72px' },
  { label: '80', value: '80px' },
  { label: '88', value: '88px' },
  { label: '96', value: '96px' },
];

export const PARAGRAPH_STYLES: StyleOption[] = [
  {
    label: 'Paragraph',
    value: 'paragraph',
    action: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    label: 'Heading 1',
    value: 'h1',
    action: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  {
    label: 'Heading 2',
    value: 'h2',
    action: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    label: 'Heading 3',
    value: 'h3',
    action: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
  },
  {
    label: 'Heading 4',
    value: 'h4',
    action: (editor) => editor.chain().focus().setHeading({ level: 4 }).run(),
  },
  {
    label: 'Heading 5',
    value: 'h5',
    action: (editor) => editor.chain().focus().setHeading({ level: 5 }).run(),
  },
  {
    label: 'Heading 6',
    value: 'h6',
    action: (editor) => editor.chain().focus().setHeading({ level: 6 }).run(),
  },
];

export const FORMATTING_BUTTONS: FormattingButton[] = [
  { mark: 'bold', icon: BoldIcon, title: 'Bold', shortcut: 'Ctrl+B' },
  { mark: 'italic', icon: ItalicIcon, title: 'Italic', shortcut: 'Ctrl+I' },
  {
    mark: 'underline',
    icon: UnderlineIcon,
    title: 'Underline',
    shortcut: 'Ctrl+U',
  },
  { mark: 'strike', icon: StrikethroughIcon, title: 'Strikethrough' },
];

export const ALIGNMENT_OPTIONS: AlignmentOption[] = [
  { value: 'left', icon: AlignLeftIcon, title: 'Align Left' },
  { value: 'center', icon: AlignCenterIcon, title: 'Align Center' },
  { value: 'right', icon: AlignRightIcon, title: 'Align Right' },
  { value: 'justify', icon: AlignJustifyIcon, title: 'Justify' },
];

export const LIST_BUTTONS: ListButton[] = [
  { mark: 'bulletList', icon: ListIcon, title: 'Bullet List' },
  { mark: 'orderedList', icon: ListOrderedIcon, title: 'Numbered List' },
];
