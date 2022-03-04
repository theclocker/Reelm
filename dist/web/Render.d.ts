declare enum AccessMethod {
    Function = 0,
    Parameter = 1
}
declare type Target = {
    access: AccessMethod;
    [key: string]: any;
};
export declare const Render: Target;
export declare const Element: Target;
export {};
