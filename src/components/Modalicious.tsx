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
    progress?: any;
    theme?: string;
    transition?: string;
    width?: string;
    height?: string;
    backgroundFade?: boolean;
    priority?: boolean;
}

const Modalicious: React.FC<ModaliciousProps> = ({ children, options }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    // Apply default options
    const { position = 'top-right', autoClose = 5000, hideProgressBar = false, closeOnClick = true, pauseOnHover = true, draggable = true, progress = undefined, theme = 'light', transition = 'Bounce', width = '300px', height = '200px', backgroundFade = false, priority = false   } = options;

    const modalStyle: React.CSSProperties = {
        width,
        height,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: '1px solid black',
        padding: '20px',
        zIndex: priority ? 100 : 10,
        opacity: backgroundFade ? 0.8 : 1,
    };

    return (
        <div className={`modal ${position}`} style={modalStyle}>
            {children}
        </div>
    );
};

export default Modalicious;
