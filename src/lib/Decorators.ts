import { nanoid } from 'nanoid';
import * as _ from 'lodash';
const deepEqual = require('deep-equal');

export namespace Reelm {

  interface IRenderContext {
    props: {[k: string]: any},
    state: {[k: string]: any},
    componentSymbol: symbol,
    setProps: (props: IRenderContext["props"]) => void,
    setState: (state: IRenderContext["state"]) => void,
    render: (...args: any[]) => any;
  }

  export function Component<T extends {new (...args: any[]): any}>(constructor: T): any {
    return class RenderContext extends constructor implements IRenderContext {
      props: {[k: string]: any} = {};
      state: {[k: string]: any} = {};

      setProps(props: {[k: string]: any}): void {
        this.props = props;
      }

      setState(state: {[k: string]: any}): void {
        this.state = state;
      }

      public get componentSymbol() {
        return Symbol(constructor.name);
      }

      render() {
        const element = super.render();
        const proxyTarget = Object.getPrototypeOf(Object.getPrototypeOf(this));
        const originalClassName = proxyTarget.constructor.name;
        if (element == undefined) {
          throw new Error(`${originalClassName} Render method must return an element, returns undefined.`);
        }
        return element;
      }
    };
  }

  export function Watch(target: any | IRenderContext, propertyKey: string, expression?: boolean | Function): void {
    const baseValue = (new target.constructor)[propertyKey];
    const returnClass = createWatchClassFromObjectPrototype(baseValue);
    Object.defineProperty(target, propertyKey, {
      get: () => returnClass,
      set: (value: any) => {
        returnClass.value = value;
      }
    });
  }

  function createWatchClassFromObjectPrototype(targetObject: any) {
    const resolvedTarget = targetObject instanceof WatchManipulated ? targetObject.manipulatedValue : targetObject;
    const returnClass: ({watchSymbol: symbol, original: WatchManipulated["original"] } & WatchProp<any>) = new (class extends WatchProp<any> {
      private _sym = Symbol(`${targetObject.constructor.name}.${nanoid()}`);
      
      public get watchSymbol() {
        return this._sym;
      }

      public get original(): WatchManipulated["original"] {
        if (targetObject instanceof WatchManipulated) return targetObject.original;
        return undefined;
      }
    })(resolvedTarget);
    const manipulationOriginal = targetObject instanceof WatchManipulated ? targetObject.original : returnClass;
    // Get the base prototype of the value that is being updated
    let propPrototype = Object.getPrototypeOf(resolvedTarget);
    // The new prototype is based on WatchProp class, this way comparing and instanceof WatchProp still works
    const newProto: {[k:string]: any} = Object.getPrototypeOf(returnClass);
    // const existingOrNewSymbol = Symbol(`${target.constructor.name}.${propertyKey}.${nanoid()}`);
    // Bind each prototype method to the return classes's value
    for (const fnName in Object.getOwnPropertyDescriptors(propPrototype)) {
      if (propPrototype[fnName] instanceof Function && newProto[fnName] === undefined) {
        newProto[fnName] = function (...args: any[]): any {
          console.log(fnName);
          // If the target's symbol prop does not exist yet, create it
          // Call the original function and store the return value
          const objectToCompare = returnClass.original != undefined ? returnClass.original : returnClass;
          const before = _.cloneDeep(objectToCompare.value);
          const newValue = returnClass.value[fnName].apply(returnClass.value, args);
          if (!deepEqual(before, objectToCompare.value)) {
            objectToCompare.addExecutionStep(manipulationOriginal.watchSymbol, fnName, args);
            // console.log(objectToCompare);
            objectToCompare.triggerChange();
          }
           // new instance of a class extending the WatchManipulated class, so you cant import and use it, its an abstract class
          const manipulationTarget = new (class extends WatchManipulated {})(manipulationOriginal, newValue);
          return createWatchClassFromObjectPrototype(manipulationTarget);
        }
      }
    }
    Object.setPrototypeOf(returnClass, newProto);
    return returnClass;
  }

  export class WatchProp<T> {

    private listeners: {(value: T): void}[] = [];
    private _execution: Map<symbol, Array<{fnName: string, argumentsArr: any[]}>> = new Map();

    constructor(private _value?: T) {
      this.recreateWithSteps = this.recreateWithSteps.bind(this);
      this.addExecutionStep = this.addExecutionStep.bind(this);
    }

    public set value(value: T) {
      this._value = value;
      this.triggerChange(value);
    }

    public get value(): T {
      return this._value;
    }

    public get execution() {
      return this._execution;
    }

    public addExecutionStep(identifier: symbol, fnName: string, argumentsArr: any[]) {
      if (!this._execution.has(identifier)) this._execution.set(identifier, new Array());
      this._execution.get(identifier).push({
        fnName, argumentsArr: argumentsArr
      });
    }

    public recreateWithSteps(identifier: symbol) {
      if (!this._execution.has(identifier)) return undefined;
      let value = this._value;
      console.log(this);
      this._execution.get(identifier).map(({fnName, argumentsArr}) =>  {
        value = (value as any)[fnName].apply(value, ...argumentsArr);
      })
      return value;
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

  export abstract class WatchManipulated {
    constructor(
      private _originalProp: {watchSymbol: symbol} & WatchProp<any>,
      private _manipulatedValue: any
    ) {};

    public get original(): {watchSymbol: symbol} & WatchProp<any> {
      return this._originalProp; // Return the original object
    }

    public get manipulatedValue(): any {
      return this._manipulatedValue;
    }
  }
}
