import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { DialogHeader } from './dialog';

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
  // Determinamos las clases de tamaño
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  const maxWidthClass = sizeClasses[size] || sizeClasses.md;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${maxWidthClass} p-0 overflow-hidden`}>
        {title ? (
          <DialogHeader className="px-6 pt-6">
            <div className="flex justify-between items-center">
              <DialogTitle>{title}</DialogTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </DialogHeader>
        ) : (
          <div className="flex justify-end px-6 pt-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
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
