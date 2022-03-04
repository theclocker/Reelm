import { Render } from ".";

export interface IReElmNode {
  props: {[k: string]: any};
  state: {[k: string]: any};
  render?: () => any;
  setProps(props: {[k: string]: any}): void;
  setState(state: {[k: string]: any}): void;
  prototype?: any;
}

type returnType = Object & IReElmNode;

export function ReElement<T extends new (...args: any[]) => returnType>(constructor: T): T & returnType {
  return new Proxy(class extends constructor {
    props: {[k: string]: any} = {};
    state: {[k: string]: any} = {};

    constructor(...args: any[]) {
      super(...args);
      // this.props = constructor.props;
      // this.state = constructor.state;
    }

    setProps(props: {[k: string]: any}): void {
      this.props = props;
    }

    setState(state: {[k: string]: any}): void {
      this.state = state;
    };
  }, {
    construct(target: any, args: any[], newTarget: any): any {
      // console.log(target, args, newTarget);
      // target.prototype.constructor(...args);
      const targetInstance = new target(...args);
      const element = targetInstance.render();
      for (const [key, value] of Object.entries(Object.getPrototypeOf((target.prototype)))) {
        if (value instanceof Function && (value as any).prop === true) {
          element[key] = value;
        }
      }
      // const targetInstance = new target;
      console.log(targetInstance);
      return element;
    }
  });
}

export const Reprop = 
  function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.prop = true;
    return descriptor.value;
  };