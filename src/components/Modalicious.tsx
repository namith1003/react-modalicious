import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../utils/store";
import {close, open, setOptions} from "../core/modalSlice";

interface ModaliciousProps {
    modalOptions: ModalOptions;
}

export interface ModalOptions {
    id?: string;
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

const Modalicious: React.FC<ModaliciousProps> = ({ modalOptions }) => {
    const { isOpen} = useSelector((state: RootState) => state.modal);

    console.log("modalicious is made");
    const [modalOpen, setModalOpen] = useState(isOpen);

    const dispatch = useDispatch();
    dispatch(setOptions(modalOptions));

    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);

    // Handle Escape key press to close the modal
    useEffect(() => {
        const handleEscapeKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                dispatch(close());
            }
        };

        document.addEventListener('keydown', handleEscapeKeyPress);

        return () => {
            document.removeEventListener('keydown', handleEscapeKeyPress);
        };
    }, []);

    const { options} = useSelector((state: RootState) => state.modal);


    if (!modalOpen) {
        return null; // Return null if modal is not open
    }


    // Apply default options
    const {
        id,
        position = 'top-right',
        autoClose = 5000,
        hideProgressBar = false,
        closeOnClick = true,
        pauseOnHover = true,
        draggable = true,
        progress = undefined,
        theme = 'light',
        transition = 'Bounce',
        width = '300px',
        height = '200px',
        backgroundFade = false,
        priority = false
    } = options;

    const onClose = () => {
        // Dispatch action to close modal here
    };

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
            <div className="overlay" style={overlayStyle} onClick={() => dispatch(close())}></div>
            <div className="modal" style={modalStyle}>
                {options.title && <h2>{options.title}</h2>}
                {options.content && <p>{options.content}</p>}
                <button onClick={() => dispatch(close())}>Close</button>
            </div>
        </div>
    );
};

export default Modalicious;
