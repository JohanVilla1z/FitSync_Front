import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { DialogHeader, DialogOverlay } from './dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) => {
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  const maxWidthClass = sizeClasses[size] || sizeClasses.md;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black/80 z-40" />
      <DialogContent
        className={`${maxWidthClass} p-0 overflow-hidden z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
        aria-labelledby={title ? 'dialog-title' : undefined}
      >
        {title ? (
          <DialogHeader className="px-6 pt-6">
            <div className="flex justify-between items-center">
              <DialogTitle
                id="dialog-title"
                className="text-gray-900 dark:text-gray-100"
              >
                {title}
              </DialogTitle>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </DialogHeader>
        ) : (
          <div className="flex justify-end px-6 pt-4">
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
        <div className="px-6 pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
