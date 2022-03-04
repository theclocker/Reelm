export interface IReElmNode {
    props: {
        [k: string]: any;
    };
    state: {
        [k: string]: any;
    };
    render?: () => any;
    setProps(props: {
        [k: string]: any;
    }): void;
    setState(state: {
        [k: string]: any;
    }): void;
    prototype?: any;
}
declare type returnType = Object & IReElmNode;
export declare function ReElement<T extends new (...args: any[]) => returnType>(constructor: T): T & returnType;
export declare const Reprop: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
export {};
