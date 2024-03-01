import {
  Id,
  NotValidatedModalProps,
  OnChangeCallback,
  ModalContainerProps,
  ModalContent,
  ModalItem,
  ModalOptions
} from '../types';
import { Default, canBeRendered} from '../utils';
import {
  ContainerObserver,
  createContainerObserver
} from './containerObserver';

interface EnqueuedModal {
  content: ModalContent<any>;
  options: NotValidatedModalProps;
}

interface RemoveParams {
  id?: Id;
  containerId: Id;
}

const containers = new Map<Id, ContainerObserver>();
let renderQueue: EnqueuedModal[] = [];
const listeners = new Set<OnChangeCallback>();

const dispatchChanges = (data: ModalItem) => listeners.forEach(cb => cb(data));

const hasContainers = () => containers.size > 0;


export const getModal = (id: Id, { containerId }: ModalOptions) =>
  containers.get(containerId || Default.CONTAINER_ID)?.modals.get(id);

export function isModalActive(id: Id, containerId?: Id) {
  if (containerId) return !!containers.get(containerId)?.isModalActive(id);

  let isActive = false;
  containers.forEach(c => {
    if (c.isModalActive(id)) isActive = true;
  });

  return isActive;
}

export function removeModal(params?: Id | RemoveParams) {
  if (!hasContainers()) {
    renderQueue = renderQueue.filter(
      v => params != null && v.options.modalId !== params
    );
    return;
  }

}

export function pushModal<TData>(
  content: ModalContent<TData>,
  options: NotValidatedModalProps
) {
  if (!canBeRendered(content)) return;
  if (!hasContainers()) renderQueue.push({ content, options });

  containers.forEach(c => {
    c.buildModal(content, options);
  });
}

interface ToggleModalParams {
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

export function toggleModal(v: boolean, opt?: ToggleModalParams) {
  containers.forEach(c => {
    if (opt == null || !opt?.containerId) {
      c.toggle(v, opt?.id);
    } else if (opt?.containerId === c.id) {
      c.toggle(v, opt?.id);
    }
  });
}

export function registerContainer(props: ModalContainerProps) {
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
    setProps(p: ModalContainerProps) {
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
