import { Modal, ModalItem, ModalItemStatus } from '../types';

export function toModalItem(modal: Modal, status: ModalItemStatus): ModalItem {
  return modal != null
    ? {
        content: modal.content,
        containerId: modal.props.containerId,
        id: modal.props.modalId,
        theme: modal.props.theme,
        type: modal.props.type,
        data: modal.props.data || {},
        isLoading: modal.props.isLoading,
        icon: modal.props.icon,
        status
      }
    :
      ({} as ModalItem);
}
