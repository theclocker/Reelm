import "reflect-metadata";

//
export interface IReElmNode {
  props: {[k: string]: any};
  state: {[k: string]: any};
  render?: () => any;
  setProps(props: {[k: string]: any}): void;
  setState(state: {[k: string]: any}): void;
}

export namespace Reelm {
  const watchMetadataKey = Symbol("watch");

  export function Component<T extends {new (...args: any[]): any}>(constructor: T): any {
    return class extends constructor {
      props: {[k: string]: any} = {};
      state: {[k: string]: any} = {};

      setProps(props: {[k: string]: any}): void {
        this.props = props;
      }

      setState(state: {[k: string]: any}): void {
        this.state = state;
      }

      render() {
        const element = super.render();
        const proxyTarget = Object.getPrototypeOf(Object.getPrototypeOf(this));
        const originalClassName = proxyTarget.constructor.name;
        if (element == undefined) {
          throw new Error(`${originalClassName} Render method must return an element, returns undefined.`);
        }
        for (const [key, value] of Object.entries(constructor.prototype)) {
          if (value instanceof Function && (value as any).prop === true) {
            element[key] = value;
          }
        }
        return element;
      }
    };
  }

  export function Watch(target: any, propertyKey: string, expression?: boolean | Function): any {
    const returnClass = new WatchProp(null);
    Object.defineProperty(target, propertyKey, {
      get: () => returnClass,
      set: (value: any) => {
        returnClass.value = value;
      }
    });
  }

  export class WatchProp {

    private listeners: {(value: any): void}[] = [];

    constructor(public _value?: any) {}

    public set value(value: any) {
      this._value = value;
      this.listeners.forEach((func) => {func(value)});
    }

    public get value() {
      return this._value;
    }

    public onChange(callback: {(value: any): void}): number {
      return this.listeners.push(callback);
    }

    public unsubscribe(index: number) {
      this.listeners.splice(index, 1);
    }
  }

  export function Prop(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.prop = true;
    return descriptor.value;
  }
}