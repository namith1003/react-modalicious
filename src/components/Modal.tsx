// components/Modal.tsx

import React, { useContext } from 'react';
import { ModalContext } from './ModalService';

const Modal: React.FC = () => {
    const modalContext = useContext(ModalContext);

    if (!modalContext) {
        // Handle case where context is not provided
        return null;
    }

    const { modalContent, hideModal } = modalContext;

    return (
        modalContent && (
            <div className="modal-overlay" onClick={hideModal}>
                <div className="modal-content">
                    {modalContent}
                </div>
            </div>
        )
    );
};

export default Modal;
