// components/modals/ConfirmLeaveModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmLeaveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmLeaveModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Unsaved Changes',
  description = 'You have unsaved changes that will be lost if you leave. Are you sure you want to continue?',
  confirmText = 'Leave',
  cancelText = 'Stay',
}: ConfirmLeaveModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-4 h-[44px]">
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 h-[44px]"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmLeaveModal;
