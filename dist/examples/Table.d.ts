declare class Table {
    private headers;
    private rows;
    something: string;
    foo: number;
    constructor(headers: any[], rows: any[][]);
    style(): string;
    onclick(event: Event): void;
    private onInputChange;
    private getRandomHeader;
    render(): any;
}
export { Table };
