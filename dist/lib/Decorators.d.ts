export declare namespace Reelm {
    interface IRenderContext {
        props: {
            [k: string]: any;
        };
        state: {
            [k: string]: any;
        };
        componentSymbol: symbol;
        setProps: (props: IRenderContext["props"]) => void;
        setState: (state: IRenderContext["state"]) => void;
        render: (...args: any[]) => any;
    }
    export function Component<T extends {
        new (...args: any[]): any;
    }>(constructor: T): any;
    export function Watch(target: any | IRenderContext, propertyKey: string, expression?: boolean | Function): void;
    export class WatchProp<T> {
        private _value?;
        private listeners;
        private _execution;
        constructor(_value?: T);
        set value(value: T);
        get value(): T;
        get execution(): Map<symbol, {
            fnName: string;
            argumentsArr: any[];
        }[]>;
        addExecutionStep(identifier: symbol, fnName: string, argumentsArr: any[]): void;
        recreateWithSteps(identifier: symbol): T;
        onChange(callback: {
            (value: T): void;
        }): number;
        unsubscribe(index: number): void;
        triggerChange(value?: T): void;
    }
    export function Prop(target: any, propertyKey: string, descriptor: PropertyDescriptor): any;
    export abstract class WatchManipulated {
        private _originalProp;
        private _manipulatedValue;
        constructor(_originalProp: {
            watchSymbol: symbol;
        } & WatchProp<any>, _manipulatedValue: any);
        get original(): {
            watchSymbol: symbol;
        } & WatchProp<any>;
        get manipulatedValue(): any;
    }
    export {};
}
