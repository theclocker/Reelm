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

  export function Component<T extends {new (...args: any[]): any}>(constructor: T): T & ((...args: any[]) => any) {
    const extender = class extends constructor {
      props: {[k: string]: any} = {};
      state: {[k: string]: any} = {};

      private renderResult: HTMLElement;

      setProps(props: {[k: string]: any}): void {
        this.props = props;
      }

      setState(state: {[k: string]: any}): void {
        this.state = state;
      }

      render(bindTarget: any) {
        const element = super.render();
        const proxyTarget = Object.getPrototypeOf(Object.getPrototypeOf(this));
        const originalClassName = proxyTarget.constructor.name;
        if (element == undefined) {
          throw new Error(`${originalClassName} Render method must return an element, returns undefined.`);
        }
        for (const [key, value] of Object.entries(constructor.prototype)) {
          if (value instanceof Function && (value as any).prop === true) {
            element[key] = value.bind(bindTarget || this);
          }
        }
        if (this.renderResult) {
          this.renderResult.parentNode.replaceChild(element.element, (this.renderResult as any).element);
        }
        this.renderResult = element;
        return this.renderResult;
      }
    };
    return new Proxy(extender, {
      construct(target: any, args: any[]): any {
        const targetInstance = new target(...args);
        const resultingProxy = new Proxy(targetInstance, {
          set(innerTarget: any, prop: any, value: any) {
            const watchParams: string[] = Reflect.getOwnMetadata(watchMetadataKey, Object.getPrototypeOf(Object.getPrototypeOf(innerTarget)));
            Reflect.set(innerTarget, prop, value);
            if (watchParams && watchParams.includes(prop)) {
              innerTarget.render.bind(resultingProxy)(resultingProxy);
            }
            return true;
          }
        });
        return resultingProxy;
      }
    });
  }

  export function Watch(target: any, propertyKey: string, expression?: boolean | Function) {
    const existingWatchParameters: string[] = Reflect.getOwnMetadata(watchMetadataKey, target) || [];
    existingWatchParameters.push(propertyKey);
    Reflect.defineMetadata(watchMetadataKey, existingWatchParameters, target);
  }

  export function WatchTwo(target: any, propertyKey: string, expression?: boolean | Function): any {
    console.log(target, propertyKey);
    return 123;
  }

  export function Prop(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.prop = true;
    return descriptor.value;
  }
}