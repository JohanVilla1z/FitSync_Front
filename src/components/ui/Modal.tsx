import { Dialog } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from './dialog';

interface ModalProps {
  /**
   * Controls whether the modal is displayed
   */
  isOpen: boolean;
  /**
   * Function called when the modal should close
   */
  onClose: () => void;
  /**
   * Modal title - required for accessibility
   */
  title: string;
  /**
   * Content to render inside the modal
   */
  children: React.ReactNode;
  /**
   * Controls the modal width
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional description for screen readers
   */
  ariaDescription?: string;
  /**
   * Optional CSS class to apply to content
   */
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  ariaDescription = 'Diálogo modal de la aplicación FitSync', // Valor predeterminado para garantizar siempre una descripción
  className,
}: ModalProps) => {
  const sizeClasses = {
    sm: 'w-full max-w-[95vw] sm:max-w-sm',
    md: 'w-full max-w-[95vw] sm:max-w-md',
    lg: 'w-full max-w-[95vw] sm:max-w-lg',
    xl: 'w-full max-w-[95vw] sm:max-w-xl',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black/80 z-40" />
      <DialogContent
        className={cn(
          sizeClasses[size],
          'p-0 overflow-hidden z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg',
          className
        )}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-gray-900 dark:text-gray-100 text-lg sm:text-xl">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              type="button"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </DialogHeader>

        {/* IMPORTANTE: Siempre incluimos la descripción, esto resuelve la advertencia */}
        <DialogDescription className="sr-only">
          {ariaDescription}
        </DialogDescription>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
