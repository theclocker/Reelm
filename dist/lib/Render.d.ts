declare enum AccessMethod {
    Function = 0,
    Parameter = 1
}
declare type Target = {
    new (...args: any[]): any;
    <T extends {
        new (...args: any[]): {};
    }>(component: T, ...classArgs: any[]): InstanceType<T>;
    access: AccessMethod;
    [key: string]: any;
};
export declare const Render: Target;
export declare const Element: Target;
export {};
