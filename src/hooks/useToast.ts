import { useRef, useState } from 'react';

import { ToastProps } from '../types';
import { registerToggle } from '../core/store';


export function useToast(props: ToastProps) {
  const [isRunning, setIsRunning] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  registerToggle({
    id: props.toastId,
    containerId: props.containerId,
    fn: setIsRunning
  });


  function playToast() {
    setIsRunning(true);
  }

  return {
    playToast,
    isRunning,
    toastRef,
  };
}
