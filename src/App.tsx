import React, { useState } from 'react';
import Modalicious from './components/Modalicious';

const App: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
      <div className="App">
        <button onClick={toggleModal}>Open Modal</button>
        {isModalOpen && (
            <Modalicious
                options={{
                  position: 'top-center',
                  backgroundFade: true,
                  priority: false,
                  width: '300px',
                  height: '200px'
                }}
            >
              <h2>This is the Modalicious Popup</h2>
              <p>You can add any content here.</p>
            </Modalicious>
        )}
      </div>
    );
}

export default App;
