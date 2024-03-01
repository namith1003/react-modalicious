import cx from 'clsx';
import React, { cloneElement, isValidElement, ReactNode } from 'react';

import { useModal } from '../hooks';
import { ModalProps } from '../types';
import { Default, isFn } from '../utils';
import { CloseButton } from './CloseButton';
import { getIcon } from './Icons';

export const Modal: React.FC<ModalProps> = props => {
  const {
    modalRef,
    playModal
  } = useModal(props);
  const {
    closeButton,
    children,
    onClick,
    type,
    closeModal,
    transition: Transition,
    position,
    className,
    style,
    bodyClassName,
    bodyStyle,
    role,
    rtl,
    modalId,
    deleteModal,
    isIn,
    isLoading,
    closeOnClick,
    theme
  } = props;
  const defaultClassName = cx(
    `${Default.CSS_NAMESPACE}__modal`,
    `${Default.CSS_NAMESPACE}__modal-theme--${theme}`,
    `${Default.CSS_NAMESPACE}__modal--${type}`,
    {
      [`${Default.CSS_NAMESPACE}__modal--rtl`]: rtl
    },
    {
      [`${Default.CSS_NAMESPACE}__modal--close-on-click`]: closeOnClick
    }
  );
  const cssClasses = isFn(className)
    ? className({
        rtl,
        position,
        type,
        defaultClassName
      })
    : cx(defaultClassName, className);
  const icon = getIcon(props);

  const closeButtonProps = { closeModal: closeModal, type, theme };
  let Close: React.ReactNode = null;

  if (closeButton === false) {
    // hide
  } else if (isFn(closeButton)) {
    Close = closeButton(closeButtonProps);
  } else if (isValidElement(closeButton)) {
    Close = cloneElement(closeButton, closeButtonProps);
  } else {
    Close = CloseButton(closeButtonProps);
  }

  return (
    <Transition
      isIn={isIn}
      done={deleteModal}
      position={position}
      nodeRef={modalRef}
      playModal={playModal} 
      preventExitTransition={false}>
      <div
        id={modalId as string}
        onClick={onClick}
        data-in={isIn}
        className={cssClasses}
        style={style}
        ref={modalRef}
      >
        <div
          {...(isIn && { role: role })}
          className={
            isFn(bodyClassName)
              ? bodyClassName({ type })
              : cx(`${Default.CSS_NAMESPACE}__modal-body`, bodyClassName)
          }
          style={bodyStyle}
        >
          {icon != null && (
            <div
              className={cx(`${Default.CSS_NAMESPACE}__modal-icon`, {
                [`${Default.CSS_NAMESPACE}--animate-icon ${Default.CSS_NAMESPACE}__zoom-enter`]:
                  !isLoading
              })}
            >
              {icon}
            </div>
          )}
          <div>{children as ReactNode}</div>
        </div>
        {Close}
      </div>
    </Transition>
  );
};
