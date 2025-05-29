import { Editor } from '@tiptap/react';

export interface StyleOption {
  label: string;
  value: string;
  action: (editor: Editor) => void;
}

export type StyleOption = {
  value: string;
  label: string;
  action: (editor: Editor) => void;
  level?: number; // Make level optional since not all styles have it
};

export type FormattingButton = {
  mark: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  shortcut?: string;
};

export type AlignmentOption = {
  value: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
};

export type ListButton = {
  mark: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
};
