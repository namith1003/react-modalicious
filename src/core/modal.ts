import {
  Id,
  IdOpts,
  NotValidatedModalProps,
  ModalContent,
  ModalOptions,
  ModalProps,
  TypeOptions,
  UpdateOptions
} from '../types';
import { Type, isFn, isNum, isStr } from '../utils';
import {
  getModal,
  isModalActive,
  onChange,
  pushModal,
  removeModal,
  toggleModal
} from './store';

/**
 * Generate a modalId or use the one provided
 */
function getModalId<TData>(options?: ModalOptions<TData>) {
  return options && (isStr(options.modalId) || isNum(options.modalId))
    ? options.modalId
    : 1;
}

/**
 * If the container is not mounted, the modal is enqueued
 */
function dispatchModal<TData>(
  content: ModalContent<TData>,
  options: NotValidatedModalProps
): Id {
  pushModal(content, options);
  return options.modalId;
}

/**
 * Merge provided options with the defaults settings and generate the modalId
 */
function mergeOptions<TData>(type: string, options?: ModalOptions<TData>) {
  return {
    ...options,
    type: (options && options.type) || type,
    modalId: getModalId(options)
  } as NotValidatedModalProps;
}

function createModalByType(type: string) {
  return <TData = unknown>(
    content: ModalContent<TData>,
    options?: ModalOptions<TData>
  ) => dispatchModal(content, mergeOptions(type, options));
}

function modal<TData = unknown>(
  content: ModalContent<TData>,
  options?: ModalOptions<TData>
) {
  return dispatchModal(content, mergeOptions(Type.DEFAULT, options));
}

modal.loading = <TData = unknown>(
  content: ModalContent<TData>,
  options?: ModalOptions<TData>
) =>
  dispatchModal(
    content,
    mergeOptions(Type.DEFAULT, {
      isLoading: true,
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      ...options
    })
  );

export interface ModalPromiseParams<
  TData = unknown,
  TError = unknown,
  TPending = unknown
> {
  pending?: string | UpdateOptions<TPending>;
  success?: string | UpdateOptions<TData>;
  error?: string | UpdateOptions<TError>;
}

function handlePromise<TData = unknown, TError = unknown, TPending = unknown>(
  promise: Promise<TData> | (() => Promise<TData>),
  { pending, error, success }: ModalPromiseParams<TData, TError, TPending>,
  options?: ModalOptions<TData>
) {
  let id: Id;

  if (pending) {
    id = isStr(pending)
      ? modal.loading(pending, options)
      : modal.loading(pending.render, {
          ...options,
          ...(pending as ModalOptions)
        } as ModalOptions<TPending>);
  }

  const resetParams = {
    isLoading: null,
    autoClose: null,
    closeOnClick: null,
    closeButton: null,
    draggable: null
  };

  const resolver = <T>(
    type: TypeOptions,
    input: string | UpdateOptions<T> | undefined,
    result: T
  ) => {
    // Remove the modal if the input has not been provided. This prevents the modal from hanging
    // in the pending state if a success/error modal has not been provided.
    if (input == null) {
      modal.dismiss(id);
      return;
    }

    const baseParams = {
      type,
      ...resetParams,
      ...options,
      data: result
    };
    const params = isStr(input) ? { render: input } : input;

    // if the id is set we know that it's an update
    if (id) {
      modal.update(id, {
        ...baseParams,
        ...params
      } as UpdateOptions);
    } else {
      // using modal.promise without loading
      modal(params!.render, {
        ...baseParams,
        ...params
      } as ModalOptions<T>);
    }

    return result;
  };

  const p = isFn(promise) ? promise() : promise;

  //call the resolvers only when needed
  p.then(result => resolver('success', success, result)).catch(err =>
    resolver('error', error, err)
  );

  return p;
}

/**
 * Supply a promise or a function that return a promise and the notification will be updated if it resolves or fails.
 * When the promise is pending a spinner is displayed by default.
 * `modal.promise` returns the provided promise so you can chain it.
 *
 * Simple example:
 *
 * ```
 * modal.promise(MyPromise,
 *  {
 *    pending: 'Promise is pending',
 *    success: 'Promise resolved 👌',
 *    error: 'Promise rejected 🤯'
 *  }
 * )
 *
 * ```
 *
 * Advanced usage:
 * ```
 * modal.promise<{name: string}, {message: string}, undefined>(
 *    resolveWithSomeData,
 *    {
 *      pending: {
 *        render: () => "I'm loading",
 *        icon: false,
 *      },
 *      success: {
 *        render: ({data}) => `Hello ${data.name}`,
 *        icon: "🟢",
 *      },
 *      error: {
 *        render({data}){
 *          // When the promise reject, data will contains the error
 *          return <MyErrorComponent message={data.message} />
 *        }
 *      }
 *    }
 * )
 * ```
 */
modal.promise = handlePromise;
modal.success = createModalByType(Type.SUCCESS);
modal.info = createModalByType(Type.INFO);
modal.error = createModalByType(Type.ERROR);
modal.warning = createModalByType(Type.WARNING);
modal.warn = modal.warning;
modal.dark = (content: ModalContent, options?: ModalOptions) =>
  dispatchModal(
    content,
    mergeOptions(Type.DEFAULT, {
      theme: 'dark',
      ...options
    })
  );

interface RemoveParams {
  id?: 1;
  containerId: 1;
}

function dismiss(params: RemoveParams): void;
function dismiss(params?: Id): void;
function dismiss(params?: Id | RemoveParams) {
  removeModal(params);
}

/**
 * Remove modal programmatically
 *
 * - Remove all modals:
 * ```
 * modal.dismiss()
 * ```
 *
 * - Remove all modals that belongs to a given container
 * ```
 * modal.dismiss({ container: "123" })
 * ```
 *
 * - Remove modal that has a given id regardless the container
 * ```
 * modal.dismiss({ id: "123" })
 * ```
 *
 * - Remove modal that has a given id for a specific container
 * ```
 * modal.dismiss({ id: "123", containerId: "12" })
 * ```
 */
modal.dismiss = dismiss;

/**
 * Clear waiting queue when limit is used
 */

/**
 * Check if a modal is active
 *
 * - Check regardless the container
 * ```
 * modal.isActive("123")
 * ```
 *
 * - Check in a specific container
 * ```
 * modal.isActive("123", "containerId")
 * ```
 */
modal.isActive = isModalActive;

/**
 * Update a modal, see https://fkhadra.github.io/react-modalify/update-modal/ for more
 *
 * Example:
 * ```
 * // With a string
 * modal.update(modalId, {
 *    render: "New content",
 *    type: "info",
 * });
 *
 * // Or with a component
 * modal.update(modalId, {
 *    render: MyComponent
 * });
 *
 * // Or a function
 * modal.update(modalId, {
 *    render: () => <div>New content</div>
 * });
 *
 * // Apply a transition
 * modal.update(modalId, {
 *   render: "New Content",
 *   type: modal.TYPE.INFO,
 *   transition: Rotate
 * })
 * ```
 */
modal.update = <TData = unknown>(
  modalId: Id,
  options: UpdateOptions<TData> = {}
) => {
  const modal = getModal(modalId, options as ModalOptions);

  if (modal) {
    const { props: oldOptions, content: oldContent } = modal;

    const nextOptions = {
      ...oldOptions,
      ...options,
      modalId: options.modalId || modalId,
      updateId: 1
    } as ModalProps & UpdateOptions;

    const content = nextOptions.render || oldContent;
    delete nextOptions.render;

    dispatchModal(content, nextOptions);
  }
};

/**
 * Used for controlled progress bar. It will automatically close the notification.
 *
 * If you don't want your notification to be clsoed when the timer is done you should use `modal.update` instead as follow instead:
 *
 * ```
 * modal.update(id, {
 *    progress: null, // remove controlled progress bar
 *    render: "ok",
 *    type: "success",
 *    autoClose: 5000 // set autoClose to the desired value
 *   });
 * ```
 */

/**
 * Subscribe to change when a modal is added, removed and updated
 *
 * Usage:
 * ```
 * const unsubscribe = modal.onChange((payload) => {
 *   switch (payload.status) {
 *   case "added":
 *     // new modal added
 *     break;
 *   case "updated":
 *     // modal updated
 *     break;
 *   case "removed":
 *     // modal has been removed
 *     break;
 *   }
 * })
 * ```
 */
modal.onChange = onChange;

/**
 * Play a modal(s) timer programmatically
 *
 * Usage:
 *
 * - Play all modals
 * ```
 * modal.play()
 * ```
 *
 * - Play all modals for a given container
 * ```
 * modal.play({ containerId: "123" })
 * ```
 *
 * - Play modal that has a given id regardless the container
 * ```
 * modal.play({ id: "123" })
 * ```
 *
 * - Play modal that has a given id for a specific container
 * ```
 * modal.play({ id: "123", containerId: "12" })
 * ```
 */
modal.play = (opts?: IdOpts) => toggleModal(true, opts);

/**
 * Pause a modal(s) timer programmatically
 *
 * Usage:
 *
 * - Pause all modals
 * ```
 * modal.pause()
 * ```
 *
 * - Pause all modals for a given container
 * ```
 * modal.pause({ containerId: "123" })
 * ```
 *
 * - Pause modal that has a given id regardless the container
 * ```
 * modal.pause({ id: "123" })
 * ```
 *
 * - Pause modal that has a given id for a specific container
 * ```
 * modal.pause({ id: "123", containerId: "12" })
 * ```
 */
modal.pause = (opts?: IdOpts) => toggleModal(false, opts);

export { modal };
