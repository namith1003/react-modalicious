import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { ModalOptions } from '../components/Modalicious'

interface ModalSliceState {
    isOpen: boolean;
    options: ModalOptions;
    id: string;
}

const initialState: ModalSliceState = {
    isOpen: false,
    options: {} as ModalOptions, // Initialize options with empty object
    id: '',
};

export const modalSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        open: (state, action) => {
            state.isOpen = true;
            state.options = action.payload;
        },
        close: (state) => {
            state.isOpen = false;
        },
        setOptions: (state, action) => {
            state.options = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { open, close, setOptions } = modalSlice.actions

export default modalSlice.reducer