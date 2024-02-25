// modaliciousHandler.js
import { useState } from 'react';

const useModalicious = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return { modalOpen, openModal, closeModal };
};

export default useModalicious;
