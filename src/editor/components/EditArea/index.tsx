import { MouseEventHandler, useEffect, useState } from "react";
import { useComponetsStore, Component } from "../../../stores/components";
import React from "react";
import { useComponentConfigStore } from "../../../stores/component-config";
import HoverMask from "../HoverMask";

export function EditArea() {
  const { components, addComponent } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  const [hoverComponentId, setHoverComponentId] = useState<number>();

  const handleMouseOver: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        return;
      }
    }
  };

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.component) {
        return null;
      }

      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  }

  return (
    <div
      className="h-[100%] edit-area"
      onMouseMove={handleMouseOver}
      onMouseLeave={() => {
        setHoverComponentId(undefined);
      }}
    >
      {renderComponents(components)}
      {hoverComponentId && (
        <HoverMask
          containerClassName="edit-area"
          componentId={hoverComponentId}
        />
      )}
    </div>
  );
}
