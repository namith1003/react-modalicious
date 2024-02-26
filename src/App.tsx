import React from 'react';
import Modalicious from './components/Modalicious';
import {useModalicious} from './hooks/useModalicious';

const App: React.FC = () => {

    const modal1 = useModalicious({
        position: 'top-center',
        backgroundFade: true,
        priority: true,
        width: '300px',
        height: '200px',
        title: "111111",
        content: "You can add any content here."
    })
    const modal2 = useModalicious({
            position: 'top-center',
            backgroundFade: true,
            priority: true,
            width: '300px',
            height: '200px',
            title: "2222222",
            content: "You can add any content here2."
    });

    return (
        <div className="App">
            <Modalicious/>
            <button onClick={modal1}>Open Modal</button>
            <button onClick={modal2}>Open Modal2</button>
        </div>
    );
};

export default App;
