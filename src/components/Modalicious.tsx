// src/components/Modalicious.tsx

import React, { useState } from 'react';

interface ModaliciousProps {
    children: React.ReactNode;
    options: ModaliciousOptions;
}

interface ModaliciousOptions {
    position?: string;
    autoClose?: number;
    hideProgressBar?: boolean;
    closeOnClick?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    progress?: any; // You can define a more specific type for progress
    theme?: string;
    transition?: string;
}

const Modalicious: React.FC<ModaliciousProps> = ({ children, options }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    };

    // Apply default options
    const { position = 'top-right', autoClose = 5000, hideProgressBar = false, closeOnClick = true, pauseOnHover = true, draggable = true, progress = undefined, theme = 'light', transition = 'Bounce' } = options;

    return (
        <div className={`modal ${position}`}>
            <div className="modal-content">
                <span className="close" onClick={handleClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default Modalicious;
