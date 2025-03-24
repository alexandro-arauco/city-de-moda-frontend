/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "react";
import ServicesInput from "./ServicesInput";

const components: Record<string, ComponentType<any>> = {
  services: ServicesInput,
}; // Define available components

interface DynamicComponentProps<T extends Record<string, any>> {
  name: string;
  props?: T;
}

const DynamicComponent = <T extends Record<string, any>>({
  name,
  props,
}: DynamicComponentProps<T>) => {
  const Component = components[name] as ComponentType<T>;
  if (!Component) {
    return null; // Handle case where the component is not found
  }

  return <Component {...(props as T)} />;
};

DynamicComponent.displayName = "DynamicComponent";

export default DynamicComponent;
