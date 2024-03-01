import cx from 'clsx';
import React, { useRef} from 'react';

import { useToastContainer } from '../hooks';
import { ToastContainerProps, ToastPosition } from '../types';
import { Default, isFn, parseClassName } from '../utils';
import { Toast } from './Toast';
import { Bounce } from './Transitions';

export const defaultProps: ToastContainerProps = {
  position: 'top-right',
  transition: Bounce,
  closeButton: true,
  role: 'alert',
  theme: 'light'
};

export function ToastContainer(props: ToastContainerProps) {
  let containerProps: ToastContainerProps = {
    ...defaultProps,
    ...props
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const { getToastToRender, isToastActive} =
    useToastContainer(containerProps);
  const { className, style, rtl, containerId } = containerProps;

  function getClassName(position: ToastPosition) {
    const defaultClassName = cx(
      `${Default.CSS_NAMESPACE}__toast-container`,
      `${Default.CSS_NAMESPACE}__toast-container--${position}`,
      { [`${Default.CSS_NAMESPACE}__toast-container--rtl`]: rtl }
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
      {getToastToRender((position, toastList) => {
        const containerStyle: React.CSSProperties = !toastList.length
          ? { ...style, pointerEvents: 'none' }
          : { ...style };

        return (
          <div
            className={getClassName(position)}
            style={containerStyle}
            key={`container-${position}`}
          >
              return (
                <Toast
                  {...toastList[0].props}
                  isIn={isToastActive(
                    toastList[0].props.toastId,
                    toastList[0].props.containerId
                  )}
                >
                  {toastList[0].content}
                </Toast>
              );
          </div>
        );
      })}
    </div>
  );
}
