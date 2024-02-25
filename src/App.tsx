import React from 'react';
import Modalicious from './components/Modalicious';
import {OpenModal, UseModalManager} from './utils/modalManager';
import {useDispatch} from "react-redux";
import {RootState} from "./utils/store";
import {open, setOptions} from "./core/modalSlice";

const App: React.FC = () => {

    const dispatch = useDispatch();

    const options = {
        position: 'top-center',
        backgroundFade: false,
        priority: false,
        width: '300px',
        height: '200px',
        title: "111111",
        content: "You can add any content here."
    }

    const options2 = {
        position: 'top-center',
        backgroundFade: false,
        priority: false,
        width: '300px',
        height: '200px',
        title: "2222222",
        content: "You can add any content here2."
    }

    return (
        <div className="App">
            <Modalicious modalOptions={options}/>
            <button onClick={() => dispatch(open(options.title))}>Open Modal</button>
            <button onClick={() => dispatch(open(options2.title))}>Open Modal2</button>

        </div>
    );
};

export default App;
