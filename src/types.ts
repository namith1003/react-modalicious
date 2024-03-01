
import { CloseButtonProps, IconProps } from './components';
import React from "react";

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type TypeOptions = 'info' | 'success' | 'warning' | 'error' | 'default';

export type Theme = 'light' | 'dark' | 'colored' | (string & {});

export type ModalPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

export interface ModalContentProps<Data = unknown> {
  closeModal: () => void;
  modalProps: ModalProps;
  data: Data;
}

export type ModalContent<T = unknown> =
  | React.ReactNode
  | ((props: ModalContentProps<T>) => React.ReactNode);

export type ModalIcon =
  | false
  | ((props: IconProps) => React.ReactNode)
  | React.ReactElement<IconProps>;

export type Id = number | string;

export type ModalTransition =
  | React.FC<ModalTransitionProps>
  | React.ComponentClass<ModalTransitionProps>;

/**
 * ClassName for the elements - can take a function to build a classname or a raw string that is cx'ed to defaults
 */
export type ModalClassName =
  | ((context?: {
      type?: TypeOptions;
      defaultClassName?: string;
      position?: ModalPosition;
      rtl?: boolean;
    }) => string)
  | string;


interface CommonOptions {

  /**
   * Remove the modal when clicked.
   * `Default: true`
   */
  closeOnClick?: boolean;

  /**
   * Set the delay in ms to close the modal automatically.
   * Use `false` to prevent the modal from closing.
   * `Default: 5000`
   */
  autoClose?: number | false;

  /**
   * Set the default position to use.
   * `One of: 'top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'`
   * `Default: 'top-right'`
   */
  position?: ModalPosition;

  /**
   * Pass a custom close button.
   * To remove the close button pass `false`
   */
  closeButton?:
    | boolean
    | ((props: CloseButtonProps) => React.ReactNode)
    | React.ReactElement<CloseButtonProps>;


  /**
   * An optional css class to set for the modal content.
   */
  bodyClassName?: ModalClassName;

  /**
   * An optional inline style to apply for the modal content.
   */
  bodyStyle?: React.CSSProperties;


  /**
   * Pass a custom transition
   */
  transition?: ModalTransition;


  /**
   * Define the ARIA role for the modal
   * `Default: alert`
   *  https://www.w3.org/WAI/PF/aria/roles
   */
  role?: string;

  /**
   * Set id to handle multiple container
   */
  containerId?: Id;

  /**
   * Fired when clicking inside modaler
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Support right to left display.
   * `Default: false`
   */
  rtl?: boolean;

  /**
   * Used to display a custom icon. Set it to `false` to prevent
   * the icons from being displayed
   */
  icon?: ModalIcon;

  /**
   * Theme to use.
   * `One of: 'light', 'dark', 'colored'`
   * `Default: 'light'`
   */
  theme?: Theme;
}

export interface ModalOptions<Data = unknown> extends CommonOptions {
  /**
   * An optional css class to set.
   */
  className?: ModalClassName;

  /**
   * Called when modal is mounted.
   */
  onOpen?: <T = {}>(props: T) => void;

  /**
   * Called when modal is unmounted.
   */
  onClose?: <T = {}>(props: T) => void;

  /**
   * An optional inline style to apply.
   */
  style?: React.CSSProperties;

  /**
   * Set the modal type.
   * `One of: 'info', 'success', 'warning', 'error', 'default'`
   */
  type?: TypeOptions;

  /**
   * Set a custom `modalId`
   */
  modalId?: Id;

  /**
   * Used during update
   */
  updateId?: Id;

  /**
   * Add a delay in ms before the modal appear.
   */
  delay?: number;

  isLoading?: boolean;

  data?: Data;
}

export interface UpdateOptions<T = unknown> extends Nullable<ModalOptions<T>> {
  /**
   * Used to update a modal.
   * Pass any valid ReactNode(string, number, component)
   */
  render?: ModalContent<T>;
}

export interface ModalContainerProps extends CommonOptions {
  /**
   * An optional css class to set.
   */
  className?: ModalClassName;

  /**
   * Whether or not to display the newest modal on top.
   * `Default: false`
   */
  newestOnTop?: boolean;

  /**
   * An optional inline style to apply.
   */
  style?: React.CSSProperties;

  /**
   * An optional inline style to apply for the modal.
   */
  modalStyle?: React.CSSProperties;

  /**
   * An optional css class for the modal.
   */
  modalClassName?: ModalClassName;

  /**
   * Limit the number of modal displayed at the same time
   */
  limit?: number;
}

export interface ModalTransitionProps {
  isIn: boolean;
  done: () => void;
  position: ModalPosition | string;
  preventExitTransition: boolean;
  nodeRef: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  playModal(): void;
}

/**
 * @INTERNAL
 */
export interface ModalProps extends ModalOptions {
  isIn: boolean;
  staleId?: Id;
  modalId: Id;
  key: Id;
  transition: ModalTransition;
  closeModal: () => void;
  position: ModalPosition;
  children?: ModalContent;
  progressClassName?: ModalClassName;
  className?: ModalClassName;
  bodyClassName?: ModalClassName;
  deleteModal: () => void;
  theme: Theme;
  type: TypeOptions;
}

/**
 * @INTERNAL
 */
export interface NotValidatedModalProps extends Partial<ModalProps> {
  modalId: Id;
}

/**
 * @INTERNAL
 */
export interface Modal {
  content: ModalContent;
  props: ModalProps;
  toggle?: (v: boolean) => void;
}

export type ModalItemStatus = 'added' | 'removed' | 'updated';

export interface ModalItem<Data = {}> {
  content: ModalContent<Data>;
  id: Id;
  theme?: Theme;
  type?: TypeOptions;
  isLoading?: boolean;
  containerId?: Id;
  data: Data;
  icon?: ModalIcon;
  status: ModalItemStatus;
}

export type OnChangeCallback = (modal: ModalItem) => void;

export type IdOpts = {
  id?: Id;
  containerId?: Id;
};
