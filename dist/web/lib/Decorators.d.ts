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
}
export declare namespace Reelm {
    function Component<T extends {
        new (...args: any[]): {};
    }>(constructor: T): T & ((...args: any[]) => any);
    function Prop(target: any, propertyKey: string, descriptor: PropertyDescriptor): any;
}
