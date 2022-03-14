//
export interface IReElmNode {
  props: {[k: string]: any};
  state: {[k: string]: any};
  render?: () => any;
  setProps(props: {[k: string]: any}): void;
  setState(state: {[k: string]: any}): void;
}

export namespace Reelm {

  export function Component<T extends {new (...args: any[]): {}}>(constructor: T): T & ((...args: any[]) => any) {
    const extender = class extends constructor {
      toke: any = 123;

      constructor(...args: any[]) {
        super(...args);
      }

      props: {[k: string]: any} = {};
      state: {[k: string]: any} = {};

      setProps(props: {[k: string]: any}): void {
        this.props = props;
      }

      setState(state: {[k: string]: any}): void {
        this.state = state;
      }
    };
    return new Proxy(extender, {
      construct(target: any, args: any[]): any {
        const targetInstance = new target(...args);
        const element = targetInstance.render();
        const originalClassName = Object.getPrototypeOf(Object.getPrototypeOf(targetInstance)).constructor.name;
        if (element == undefined) {
          throw new Error(`${originalClassName} Render method must return an element, returns undefined.`);
        }
        for (const [key, value] of Object.entries(constructor.prototype)) {
          if (value instanceof Function && (value as any).prop === true) {
            element[key] = value;
          }
        }
        return element;
      },

      // apply(target: any, handler: any): any {
      //   console.log(target, handler);
      // }
    });
  }

  export function Prop(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.prop = true;
    return descriptor.value;
  }
}