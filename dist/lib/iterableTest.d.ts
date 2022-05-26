export {};
declare global {
    type IterableWithAdditions<T> = {
        forEach: (func: (value: T, index: number, originalIndex?: number) => void) => void;
    };
    interface Array<T> {
        valids: IterableIterator<T> & IterableWithAdditions<T>;
        concretePositives: IterableIterator<T> & IterableWithAdditions<T>;
        positives: IterableIterator<T> & IterableWithAdditions<T>;
        filterNegation: <T>(filterFalse?: boolean, filterZero?: boolean) => IterableIterator<T>;
    }
}
