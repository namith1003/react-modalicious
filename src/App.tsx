import React from 'react';
import Modalicious from './components/Modalicious';
import useModal from './components/useModal';

const App: React.FC = () => {
    const { isOpen, openModal, closeModal, options } = useModal();

    const handleOpenModal = () => {
        openModal({
            position: 'top-center',
            backgroundFade: false,
            priority: false,
            width: '300px',
            height: '200px',
            title: "This is the Modalicious Popups",
            content: "You can add any content here."
        });
    };

    return (
        <div className="App">
            <button onClick={handleOpenModal}>Open Modal</button>
            {isOpen && (
                <Modalicious options={options} onClose={closeModal}>
                </Modalicious>
            )}
        </div>
    );
};

export default App;
