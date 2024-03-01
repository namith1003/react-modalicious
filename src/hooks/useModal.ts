import { useRef, useState } from 'react';

import { ModalProps } from '../types';
import { registerToggle } from '../core/store';


export function useModal(props: ModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  registerToggle({
    id: props.modalId,
    containerId: props.containerId,
    fn: setIsRunning
  });


  function playModal() {
    setIsRunning(true);
  }

  return {
    playModal,
    isRunning,
    modalRef,
  };
}
