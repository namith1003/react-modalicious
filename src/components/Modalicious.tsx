import React, {useEffect, useState} from 'react';

interface ModaliciousProps {
    options: ModaliciousOptions;
    onClose: () => void;
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
    title?: string;
    content?: string;
}
const onClose = () => {}
const Modalicious: React.FC<ModaliciousProps> = ({ options , onClose}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    // Apply default options
    const { position = 'top-right', autoClose = 5000, hideProgressBar = false, closeOnClick = true, pauseOnHover = true, draggable = true, progress = undefined, theme = 'light', transition = 'Bounce', width = '300px', height = '200px', backgroundFade = false, priority = false   } = options;

    useEffect(() => {
        // Handle Escape key press to close the modal
        const handleEscapeKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKeyPress);

        return () => {
            document.removeEventListener('keydown', handleEscapeKeyPress);
        };
    }, [onClose]);


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
        zIndex: 1000,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    };

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999
    };

    return (
        <div>
            <div className="overlay" style={overlayStyle}></div>
            <div className={`modal ${position}`} style={modalStyle}>
                {options.title && <h2>{options.title}</h2>}
                {options.content && <p>{options.content}</p>}
            </div>
        </div>
    );
};

export default Modalicious;
