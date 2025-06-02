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
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';

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
    // Disable the built-in list extensions to avoid conflicts
    bulletList: false,
    orderedList: false,
    listItem: false,
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
  Color.configure({
    types: ['textStyle'],
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'list-disc pl-6',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'list-decimal pl-6',
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: 'mb-1',
    },
  }),

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
    label: 'H1',
    value: 'h1',
    level: 1,
    action: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  {
    label: 'H2',
    value: 'h2',
    level: 2,
    action: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    label: 'H3',
    value: 'h3',
    level: 3,
    action: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
  },
  {
    label: 'H4',
    value: 'h4',
    level: 4,
    action: (editor) => editor.chain().focus().setHeading({ level: 4 }).run(),
  },
  {
    label: 'H5',
    value: 'h5',
    level: 5,
    action: (editor) => editor.chain().focus().setHeading({ level: 5 }).run(),
  },
  {
    label: 'H6',
    value: 'h6',
    level: 6,
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
