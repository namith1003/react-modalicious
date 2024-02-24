// src/App.tsx

import React from 'react';
import './App.css';
import Modalicious from './components/Modalicious';

const App: React.FC = () => {
  const modalOptions = {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
    transition: 'Bounce'
  };

  return (
      <div className="App">
        <Modalicious options={modalOptions}>
          <h1>Welcome to Modalicious</h1>
          <p>This is a test modal using the Modalicious component!</p>
        </Modalicious>
      </div>
  );
};

export default App;
