import cx from 'clsx';
import React, { useRef} from 'react';

import { useModalContainer } from '../hooks';
import { ModalContainerProps, ModalPosition } from '../types';
import { Default, isFn, parseClassName } from '../utils';
import { Modal } from './Modal';
import { Bounce } from './Transitions';

export const defaultProps: ModalContainerProps = {
  position: 'top-right',
  transition: Bounce,
  closeButton: true,
  role: 'alert',
  theme: 'light'
};

export function ModalContainer(props: ModalContainerProps) {
  let containerProps: ModalContainerProps = {
    ...defaultProps,
    ...props
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const { getModalToRender, isModalActive} =
    useModalContainer(containerProps);
  const { className, style, rtl, containerId } = containerProps;

  function getClassName(position: ModalPosition) {
    const defaultClassName = cx(
      `${Default.CSS_NAMESPACE}__modal-container`,
      `${Default.CSS_NAMESPACE}__modal-container--${position}`,
      { [`${Default.CSS_NAMESPACE}__modal-container--rtl`]: rtl }
    );
    return isFn(className)
      ? className({
          position,
          rtl,
          defaultClassName
        })
      : cx(defaultClassName, parseClassName(className));
  }
  return (
    <div
      ref={containerRef}
      className={Default.CSS_NAMESPACE as string}
      id={containerId as string}
    >
      {getModalToRender((position, modalList) => {
        const containerStyle: React.CSSProperties = !modalList.length
          ? { ...style, pointerEvents: 'none' }
          : { ...style };

        return (
          <div
            className={getClassName(position)}
            style={containerStyle}
            key={`container-${position}`}
          >
              return (
                <Modal
                  {...modalList[0].props}
                  isIn={isModalActive(
                    modalList[0].props.modalId,
                    modalList[0].props.containerId
                  )}
                >
                  {modalList[0].content}
                </Modal>
              );
          </div>
        );
      })}
    </div>
  );
}
