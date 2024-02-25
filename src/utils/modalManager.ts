import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import {open, setOptions} from "../core/modalSlice"; // Assuming ModalAction is the type for your openModal action

interface ModalOptions {
    id: string;
    position?: string;
    backgroundFade?: boolean;
    priority?: boolean;
    width?: string;
    height?: string;
    title?: string;
    content?: string;
}

export function OpenModal(modalOptions: ModalOptions){
    console.log("modal opening 2");
    const isOpen = useSelector((state: RootState) => state.modal.isOpen);
    const options = useSelector((state: RootState) => state.modal.options);

    console.log(isOpen, options);
    const dispatch = useDispatch();
    dispatch(setOptions(modalOptions));
    dispatch(open(modalOptions.id));
    console.log("modal opened");
}

export const UseModalManager = () => {
    const { isOpen, options } = useSelector((state: RootState) => state.modal);
    console.log(isOpen, options, "hey");
    return {
        isOpen,
        options
    };
};
