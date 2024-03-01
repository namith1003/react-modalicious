import React from 'react';
import {ToastContainer} from './components';
import {toast} from './core';
import 'react-toastify/dist/ReactToastify.css';
import {ToastOptions} from "./types";

function App(){

    const options: ToastOptions = {
        position: "top-right",
        closeOnClick: false,
        theme: "dark",
        containerId: 1,
    }
    const options2: ToastOptions = {
      position: "bottom-right",
      closeOnClick: false,
      theme: "transparent",
      containerId: 2,
  }
    const notify = () => toast("Wow so easy!", options);
    const notify2 = () => toast("Wow so easy2!", options2);

    return (
      <div>
        <button onClick={notify}>Notify1!</button>
        <ToastContainer containerId={1}/>
        <ToastContainer containerId={2}/>
        <button onClick={notify2}>Notify2!</button>
      </div>
  );
}

export default App;
