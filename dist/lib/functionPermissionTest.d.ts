declare const permissions: {
    [k: string]: boolean;
};
declare class Users {
    user(id: String, p?: Awaited<Promise<any>>): Promise<void>;
    purchases(userId: String, p?: Awaited<Promise<any>>): Promise<void>;
}
declare class Pets {
    purchases(userId: String, p?: Awaited<Promise<any>>): Promise<void>;
}
declare function service<T extends {
    new (...args: any[]): any;
}>(constructor: T): any;
declare function callable(url: string, fetchArgs?: {
    [k: string]: any;
}): Function;
declare const usersService: Users;
declare const petsService: Pets;
