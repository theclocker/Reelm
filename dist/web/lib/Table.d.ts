declare class Table {
    private headers;
    private rows;
    constructor(headers: any[], rows: any[][]);
    style(): string;
    onclick(event: Event): void;
    render(): any;
}
export { Table };
