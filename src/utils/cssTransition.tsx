import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { collapseModal } from './collapseModal';
import { Default } from './constant';

import { ModalTransitionProps } from '../types';

export interface CSSTransitionProps {
  /**
   * Css class to apply when modal enter
   */
  enter: string;

  /**
   * Css class to apply when modal leave
   */
  exit: string;

  /**
   * Append current modal position to the classname.
   * If multiple classes are provided, only the last one will get the position
   * For instance `myclass--top-center`...
   * `Default: false`
   */
  appendPosition?: boolean;

  /**
   * Collapse modal smoothly when exit animation end
   * `Default: true`
   */
  collapse?: boolean;

  /**
   * Collapse transition duration
   * `Default: 300`
   */
  collapseDuration?: number;
}

const enum AnimationStep {
  Enter,
  Exit
}

/**
 * Css animation that just work.
 * You could use animate.css for instance
 *
 *
 * ```
 * cssTransition({
 *   enter: "animate__animated animate__bounceIn",
 *   exit: "animate__animated animate__bounceOut"
 * })
 * ```
 *
 */
export function cssTransition({
  enter,
  exit,
  appendPosition = false,
  collapse = true,
  collapseDuration = Default.COLLAPSE_DURATION
}: CSSTransitionProps) {
  return function ModalTransition({
    children,
    position,
    preventExitTransition,
    done,
    nodeRef,
    isIn,
    playModal
  }: ModalTransitionProps) {
    const enterClassName = appendPosition ? `${enter}--${position}` : enter;
    const exitClassName = appendPosition ? `${exit}--${position}` : exit;
    const animationStep = useRef(AnimationStep.Enter);

    useLayoutEffect(() => {
      const node = nodeRef.current!;
      const classToToken = enterClassName.split(' ');

      const onEntered = (e: AnimationEvent) => {
        if (e.target !== nodeRef.current) return;

        playModal();
        node.removeEventListener('animationend', onEntered);
        node.removeEventListener('animationcancel', onEntered);
        if (
          animationStep.current === AnimationStep.Enter &&
          e.type !== 'animationcancel'
        ) {
          node.classList.remove(...classToToken);
        }
      };

      const onEnter = () => {
        node.classList.add(...classToToken);
        node.addEventListener('animationend', onEntered);
        node.addEventListener('animationcancel', onEntered);
      };

      onEnter();
    }, []);

    useEffect(() => {
      const node = nodeRef.current!;

      const onExited = () => {
        node.removeEventListener('animationend', onExited);
        collapse ? collapseModal(node, done, collapseDuration) : done();
      };

      const onExit = () => {
        animationStep.current = AnimationStep.Exit;
        node.className += ` ${exitClassName}`;
        node.addEventListener('animationend', onExited);
      };

      if (!isIn) preventExitTransition ? onExited() : onExit();
    }, [isIn]);

    return <>{children}</>;
  };
}
