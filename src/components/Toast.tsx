import cx from 'clsx';
import React, { cloneElement, isValidElement, ReactNode } from 'react';

import { useToast } from '../hooks';
import { ToastProps } from '../types';
import { Default, isFn } from '../utils';
import { CloseButton } from './CloseButton';
import { getIcon } from './Icons';

export const Toast: React.FC<ToastProps> = props => {
  const {
    toastRef,
    playToast
  } = useToast(props);
  const {
    closeButton,
    children,
    onClick,
    type,
    closeToast,
    transition: Transition,
    position,
    className,
    style,
    bodyClassName,
    bodyStyle,
    role,
    rtl,
    toastId,
    deleteToast,
    isIn,
    isLoading,
    closeOnClick,
    theme
  } = props;
  const defaultClassName = cx(
    `${Default.CSS_NAMESPACE}__toast`,
    `${Default.CSS_NAMESPACE}__toast-theme--${theme}`,
    `${Default.CSS_NAMESPACE}__toast--${type}`,
    {
      [`${Default.CSS_NAMESPACE}__toast--rtl`]: rtl
    },
    {
      [`${Default.CSS_NAMESPACE}__toast--close-on-click`]: closeOnClick
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

  const closeButtonProps = { closeToast, type, theme };
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
      done={deleteToast}
      position={position}
      nodeRef={toastRef}
      playToast={playToast} 
      preventExitTransition={false}>
      <div
        id={toastId as string}
        onClick={onClick}
        data-in={isIn}
        className={cssClasses}
        style={style}
        ref={toastRef}
      >
        <div
          {...(isIn && { role: role })}
          className={
            isFn(bodyClassName)
              ? bodyClassName({ type })
              : cx(`${Default.CSS_NAMESPACE}__toast-body`, bodyClassName)
          }
          style={bodyStyle}
        >
          {icon != null && (
            <div
              className={cx(`${Default.CSS_NAMESPACE}__toast-icon`, {
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
