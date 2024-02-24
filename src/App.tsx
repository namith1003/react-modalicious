import React, { useState } from 'react';
import Modalicious from './components/Modalicious';

const App: React.FC = () => {

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
      <div className="App">
        <button onClick={openModal}>Open Modal</button>
        {modalOpen && (
            <Modalicious
                options={{
                  position: 'top-center',
                  backgroundFade: false,
                  priority: false,
                  width: '300px',
                  height: '200px'
                }}
             onClose={closeModal}>
              <h2>This is the Modalicious Popup</h2>
              <p>You can add any content here.</p>
            </Modalicious>
        )}
      </div>
    );
}

export default App;
