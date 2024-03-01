import {
  Id,
  NotValidatedToastProps,
  OnChangeCallback,
  ToastContainerProps,
  ToastContent,
  ToastItem,
  ToastOptions
} from '../types';
import { Default, canBeRendered} from '../utils';
import {
  ContainerObserver,
  createContainerObserver
} from './containerObserver';

interface EnqueuedToast {
  content: ToastContent<any>;
  options: NotValidatedToastProps;
}

interface RemoveParams {
  id?: Id;
  containerId: Id;
}

const containers = new Map<Id, ContainerObserver>();
let renderQueue: EnqueuedToast[] = [];
const listeners = new Set<OnChangeCallback>();

const dispatchChanges = (data: ToastItem) => listeners.forEach(cb => cb(data));

const hasContainers = () => containers.size > 0;


export const getToast = (id: Id, { containerId }: ToastOptions) =>
  containers.get(containerId || Default.CONTAINER_ID)?.toasts.get(id);

export function isToastActive(id: Id, containerId?: Id) {
  if (containerId) return !!containers.get(containerId)?.isToastActive(id);

  let isActive = false;
  containers.forEach(c => {
    if (c.isToastActive(id)) isActive = true;
  });

  return isActive;
}

export function removeToast(params?: Id | RemoveParams) {
  if (!hasContainers()) {
    renderQueue = renderQueue.filter(
      v => params != null && v.options.toastId !== params
    );
    return;
  }

}

export function pushToast<TData>(
  content: ToastContent<TData>,
  options: NotValidatedToastProps
) {
  if (!canBeRendered(content)) return;
  if (!hasContainers()) renderQueue.push({ content, options });

  containers.forEach(c => {
    c.buildToast(content, options);
  });
}

interface ToggleToastParams {
  id?: Id;
  containerId?: Id;
}

type RegisterToggleOpts = {
  id: Id;
  containerId?: Id;
  fn: (v: boolean) => void;
};

export function registerToggle(opts: RegisterToggleOpts) {
  containers
    .get(opts.containerId || Default.CONTAINER_ID)
    ?.setToggle(opts.id, opts.fn);
}

export function toggleToast(v: boolean, opt?: ToggleToastParams) {
  containers.forEach(c => {
    if (opt == null || !opt?.containerId) {
      c.toggle(v, opt?.id);
    } else if (opt?.containerId === c.id) {
      c.toggle(v, opt?.id);
    }
  });
}

export function registerContainer(props: ToastContainerProps) {
  const id = props.containerId || Default.CONTAINER_ID;
  return {
    subscribe(notify: () => void) {
      const container = createContainerObserver(id, props, dispatchChanges);

      containers.set(id, container);
      const unobserve = container.observe(notify);

      return () => {
        unobserve();
        containers.delete(id);
      };
    },
    setProps(p: ToastContainerProps) {
      containers.get(id)?.setProps(p);
    },
    getSnapshot() {
      return containers.get(id)?.getSnapshot();
    }
  };
}

export function onChange(cb: OnChangeCallback) {
  listeners.add(cb);

  return () => {
    listeners.delete(cb);
  };
}
