// components/ModalService.ts

import React, { createContext, useState, ReactNode } from 'react';
import Modal from "./Modal";

interface ModalContextType {
    showModal: (content: ReactNode) => void;
    hideModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC = ({ children }) => {
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);

    const showModal = (content: ReactNode) => {
        setModalContent(content);
    };

    const hideModal = () => {
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            <Modal /> {/* Render the modal component */}
        </ModalContext.Provider>
    );
};
