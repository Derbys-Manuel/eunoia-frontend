import React, { ReactNode } from 'react';
import { Button } from './ui/button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    className,
}) => {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}>
            <div className={`bg-white rounded-lg shadow-lg w-124 ${className ?? ''}`}>
                {title && (
                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                )}
                <div className="px-6 py-4">
                    {children}
                </div>
                {footer && (
                    <div className="border-t px-6 py-4 flex justify-end gap-2">
                        {footer}
                    </div>
                )}
                {!footer && (
                    <div className="border-t px-6 py-4 flex justify-end">
                        <Button type="submit" className='bg-black text-white hover:bg-gray-800 hover:scale-[1.02] transition-all' onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
