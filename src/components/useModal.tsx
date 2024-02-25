import { useState } from 'react';

export interface ModalOptions {
    position?: string;
    width?: string;
    height?: string;
    title?: string;
    content?: string;
    priority?: boolean;
    backgroundFade?: boolean;
}

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ModalOptions>({
        position: 'top-center',
        width: '300px',
        height: '200px'
    });

    const openModal = (newOptions?: ModalOptions) => {
        if (newOptions) {
            setOptions({ ...options, ...newOptions });
        }
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return {
        isOpen,
        openModal,
        closeModal,
        options
    };
};

export default useModal;
