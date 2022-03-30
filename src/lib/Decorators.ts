
export namespace Reelm {

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

  export function Watch(target: any, propertyKey: string, expression?: boolean | Function): void {
    const baseValue = (new target.constructor)[propertyKey];
    // Create a new anonymous class for each prop, since setPrototypeOf sets the internal prototype of the target
    const returnClass = new (class extends WatchProp<any> {
      constructor(...args: any[]) {
        super(...args);
      }
    })(baseValue);
    // Get the base prototype of the value that is being updated
    let propPrototype = Object.getPrototypeOf(baseValue);
    // The new prototype is based on WatchProp class, this way comparing and instanceof WatchProp still works
    const newProto: {[k:string]: any} = Object.getPrototypeOf(returnClass);
    // Bind each prototype method to the return classes's value
    for (const fnName in Object.getOwnPropertyDescriptors(propPrototype)) {
      if (propPrototype[fnName] instanceof Function && newProto[fnName] === undefined) {
        newProto[fnName] = function () {
          return propPrototype[fnName].apply(returnClass.value, arguments);
        }
      }
    }
    Object.setPrototypeOf(returnClass, newProto);
    Object.defineProperty(target, propertyKey, {
      // get: () => new Proxy(returnClass, {
      //   get(innerTarget: any, prop: any, receiver: any) {
      //     const res = Reflect.get(innerTarget, prop, receiver);
      //     if (res instanceof Function) {
      //       return new Proxy(res, {
      //         apply(applyTarget: any, thisArg: any, args: any[]) {
      //           console.log(innerTarget, thisArg, args);
      //           const valueBeforeApply = JSON.parse(JSON.stringify(innerTarget.value));
      //           const applyRes = Reflect.apply(applyTarget, thisArg, args);
      //           console.log(valueBeforeApply, innerTarget.value);
      //           if (valueBeforeApply !== innerTarget.value) {
      //             console.log('Change');
      //             innerTarget.triggerChange();
      //           }
      //           return applyRes;
      //         }
      //       });
      //     }
      //     return res;
      //   }
      // }),
      get: () => returnClass,
      set: (value: any) => {
        returnClass.value = value;
      }
    });
  }

  export class WatchProp<T> {

    private listeners: {(value: T): void}[] = [];

    constructor(private _value?: T) {}

    public set value(value: T) {
      this._value = value;
      this.triggerChange(value);
    }

    public get value(): T {
      return this._value;
    }

    public onChange(callback: {(value: T): void}): number {
      return this.listeners.push(callback);
    }

    public unsubscribe(index: number) {
      this.listeners.splice(index, 1);
    }

    public triggerChange(value?: T) {
      this.listeners.forEach((func) => {
        // Call each of the callbacks when the value is updated
        func(value ?? this._value);
      });
    }
  }

  export function Prop(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value.prop = true;
    return descriptor.value;
  }
}