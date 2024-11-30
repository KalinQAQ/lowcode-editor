/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

// 每个Component节点的类型，children和parentId关联父子节点
export interface Component {
  id: number;
  name: string;
  props: any;
  desc?: string;
  children?: Component[];
  parentId?: number;
}

// 用children属性连接起来的树形结构
interface State {
  components: Component[];
  curComponentId?: number | null;
  curComponent: Component | null;
}

// 修改组件树的方法
interface Action {
  addComponent: (component: Component, parentId?: number) => void;
  deleteComponent: (componentId: number) => void;
  updateComponentProps: (componentId: number, props: any) => void;
  setCurComponentId: (componentId: number | null) => void;
}

export const useComponetsStore = create<State & Action>((set, get) => ({
  components: [
    {
      id: 1,
      name: "Page",
      props: {},
      desc: "页面",
    },
  ],
  curComponentId: null,
  curComponent: null,
  setCurComponentId: (componentId) => {
    set((state) => ({
      curComponent: getComponentById(componentId, state.components),
      curComponentId: componentId,
    }));
  },
  addComponent: (component, parentId) =>
    set((state) => {
      if (parentId) {
        const parentComponent = getComponentById(parentId, state.components);

        if (parentComponent) {
          if (parentComponent.children) {
            parentComponent.children.push(component);
          } else {
            parentComponent.children = [component];
          }
        }

        component.parentId = parentId;
        return { components: [...state.components] };
      }
      return { components: [...state.components, component] };
    }),
  deleteComponent: (componentId) => {
    if (!componentId) return;

    const component = getComponentById(componentId, get().components);
    if (component?.parentId) {
      const parentComponent = getComponentById(
        component.parentId,
        get().components
      );

      if (parentComponent) {
        parentComponent.children = parentComponent?.children?.filter(
          (item) => item.id !== +componentId
        );

        set({ components: [...get().components] });
      }
    }
  },
  updateComponentProps: (componentId, props) =>
    set((state) => {
      const component = getComponentById(componentId, state.components);
      if (component) {
        component.props = { ...component.props, ...props };

        return { components: [...state.components] };
      }

      return { components: [...state.components] };
    }),
}));

export function getComponentById(
  id: number | null,
  components: Component[]
): Component | null {
  if (!id) return null;
  //  树形结构查找节点，通过递归
  for (const component of components) {
    if (component.id == id) return component;
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children);
      if (result !== null) return result;
    }
  }
  return null;
}
