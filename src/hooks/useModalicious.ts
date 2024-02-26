import {useDispatch} from "react-redux";
import {open} from "../core/modalSlice";

export function useModalicious(options: any){
    const dispatch = useDispatch();

    return () => dispatch(open(options));
}