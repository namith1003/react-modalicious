import React from 'react';
import Modalicious from './components/Modalicious';
import {OpenModal, UseModalManager} from './utils/modalManager';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./utils/store";
import {open, setOptions} from "./core/modalSlice";

const App: React.FC = () => {

    const isOpen = useSelector((state:RootState) => state.modal.isOpen)
    const dispatch = useDispatch();
    console.log(isOpen);
    const options = {
        id: 'modal1',
        position: 'top-center',
        backgroundFade: false,
        priority: false,
        width: '300px',
        height: '200px',
        title: "This is the Modalicious Popups",
        content: "You can add any content here."
    }

    const options2 = {
        id: 'modal2',
        position: 'top-center',
        backgroundFade: false,
        priority: false,
        width: '300px',
        height: '200px',
        title: "This is the Modalicious Popups2",
        content: "You can add any content here2."
    }

    return (
        <div className="App">
            <button onClick={() => dispatch(open())}>Open Modal</button>
            <Modalicious modalOptions={options}/>
            <button onClick={() => dispatch(open())}>Open Modal</button>
            <Modalicious modalOptions={options}/>
        </div>
    );
};

export default App;
