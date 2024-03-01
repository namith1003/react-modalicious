import { useRef, useSyncExternalStore } from 'react';
import { isModalActive, registerContainer } from '../core/store';
import { Modal, ModalContainerProps, ModalPosition } from '../types';

export function useModalContainer(props: ModalContainerProps) {
  const { subscribe, getSnapshot, setProps } = useRef(
    registerContainer(props)
  ).current;
  setProps(props);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  function getModalToRender<T>(
    cb: (position: ModalPosition, modalList: Modal[]) => T
  ) {
    if (!snapshot) return [];

    const toRender = new Map<ModalPosition, Modal[]>();

    snapshot.forEach(modal => {
      const { position } = modal.props;
      toRender.has(position) || toRender.set(position, []);
      toRender.get(position)!.push(modal);
    });

    return Array.from(toRender, p => cb(p[0], p[1]));
  }

  return {
    getModalToRender,
    isModalActive,
    count: snapshot?.length
  };
}
