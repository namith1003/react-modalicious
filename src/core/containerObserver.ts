import { ReactElement, cloneElement, isValidElement } from 'react';
import {
  Id,
  NotValidatedModalProps,
  OnChangeCallback,
  Modal,
  ModalContainerProps,
  ModalContent,
  ModalProps
} from '../types';
import {
  canBeRendered,
  isFn,
  isStr,
  parseClassName,
  toModalItem
} from '../utils';


type Notify = () => void;

interface ActiveModal {
  content: ModalContent<any>;
  props: ModalProps;
  staleId?: Id;
}

export type ContainerObserver = ReturnType<typeof createContainerObserver>;

export function createContainerObserver(
  id: Id,
  containerProps: ModalContainerProps,
  dispatchChanges: OnChangeCallback
) {
  let modalKey = 1;
  let activeModals: Id[] = [];
  let snapshot: Modal[] = [];
  let props = containerProps;
  const modals = new Map<Id, Modal>();
  const listeners = new Set<Notify>();

  const observe = (notify: Notify) => {
    listeners.add(notify);
    return () => listeners.delete(notify);
  };

  const notify = () => {
    snapshot = Array.from(modals.values());
    listeners.forEach(cb => cb());
  };

  const shouldIgnoreModal = ({
    containerId,
    modalId,
    updateId
  }: NotValidatedModalProps) => {
    const containerMismatch = containerId ? containerId !== id : id !== 1;
    const isDuplicate = modals.has(modalId) && updateId == null;

    return containerMismatch || isDuplicate;
  };

  const toggle = (v: boolean, id?: Id) => {
    modals.forEach(t => {
      if (id == null || id === t.props.modalId) isFn(t.toggle) && t.toggle(v);
    });
  };

  const removeModal = (id?: Id) => {
    activeModals = id == null ? [] : activeModals.filter(v => v !== id);
    notify();
  };


  const addActiveModal = (modal: ActiveModal) => {
    const { modalId, onOpen, updateId, children } = modal.props;
    const isNew = updateId == null;

    if (modal.staleId) modals.delete(modal.staleId);

    modals.set(modalId, modal);
    activeModals = [...activeModals, modal.props.modalId].filter(
      v => v !== modal.staleId
    );
    notify();
    dispatchChanges(toModalItem(modal, isNew ? 'added' : 'updated'));

    if (isNew && isFn(onOpen))
      onOpen(isValidElement(children) && children.props);
  };

  const buildModal = <TData = unknown>(
    content: ModalContent<TData>,
    options: NotValidatedModalProps
  ) => {
    if (shouldIgnoreModal(options)) return;

    const { modalId, updateId, data, staleId} = options;
    const closeModal = () => {
      removeModal(modalId);
    };

    const modalProps = {
      ...props,
      style: props.modalStyle,
      key: modalKey++,
      ...Object.fromEntries(
        Object.entries(options).filter(([_, v]) => v != null)
      ),
      modalId: modalId,
      updateId,
      data,
      closeModal: closeModal,
      isIn: false,
      className: parseClassName(options.className || props.modalClassName),
      bodyClassName: parseClassName(
        options.bodyClassName || props.bodyClassName
      ),
      deleteModal() {
        const modalToRemove = modals.get(modalId)!;
        const { onClose, children } = modalToRemove.props;
        if (isFn(onClose)) onClose(isValidElement(children) && children.props);

        dispatchChanges(toModalItem(modalToRemove, 'removed'));
        modals.delete(modalId);

        notify();
      }
    } as ModalProps;

    modalProps.closeButton = props.closeButton;

    if (options.closeButton === false || canBeRendered(options.closeButton)) {
      modalProps.closeButton = options.closeButton;
    } else if (options.closeButton === true) {
      modalProps.closeButton = canBeRendered(props.closeButton)
        ? props.closeButton
        : true;
    }

    let modalContent = content;

    if (isValidElement(content) && !isStr(content.type)) {
      modalContent = cloneElement(content as ReactElement, {
        closeModal: closeModal,
        modalProps: modalProps,
        data
      });
    } else if (isFn(content)) {
      modalContent = content({ closeModal: closeModal, modalProps: modalProps, data: data as TData });
    }

    const activeModal = {
      content: modalContent,
      props: modalProps,
      staleId
    };

    addActiveModal(activeModal);

  };

  return {
    id,
    props,
    observe,
    toggle,
    removeModal: removeModal,
    modals: modals,
    buildModal: buildModal,
    setProps(p: ModalContainerProps) {
      props = p;
    },
    setToggle: (id: Id, fn: (v: boolean) => void) => {
      modals.get(id)!.toggle = fn;
    },
    isModalActive: (id: Id) => activeModals.some(v => v === id),
    getSnapshot: () => (props.newestOnTop ? snapshot.reverse() : snapshot)
  };
}
