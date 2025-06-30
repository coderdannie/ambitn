// components/modals/ConfirmLeaveModal.tsx
'use client';

import CustomSpinner from '../common/Loaders/Spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
}

const CancelModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Unsaved Changes',
  description = 'You have unsaved changes that will be lost if you leave. Are you sure you want to continue?',
  confirmText = 'Leave',
  cancelText = 'Stay',
  isPending,
}: CancelModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </AlertDialogTitle>
          {!isPending && (
            <AlertDialogDescription className="text-gray-600">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {isPending ? (
          <div className="py-4">
            <CustomSpinner />
          </div>
        ) : (
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose} className="px-4 h-[44px]">
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="px-4 h-[44px] bg-red-600 hover:bg-red-700"
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelModal;
