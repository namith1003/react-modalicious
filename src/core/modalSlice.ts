import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { ModalOptions } from '../components/Modalicious'

interface ModalSliceState {
    isOpen: boolean;
    options: ModalOptions;
}

const initialState: ModalSliceState = {
    isOpen: false,
    options: {} as ModalOptions, // Initialize options with empty object
};

export const modalSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        open: (state) => {
            state.isOpen = true
        },
        close: (state) => {
            state.isOpen = false
        },
        setOptions: (state, action) => {
            state.options = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { open, close, setOptions } = modalSlice.actions

export default modalSlice.reducer