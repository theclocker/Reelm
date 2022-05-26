export {}

declare global {
  type IterableWithAdditions<T> = {
    forEach: (func: (value: T, index: number, originalIndex?: number) => void) => void,
  };

  interface Array<T> {
    valids: IterableIterator<T> & IterableWithAdditions<T>;
    concretePositives: IterableIterator<T> & IterableWithAdditions<T>;
    positives: IterableIterator<T> & IterableWithAdditions<T>;
    filterNegation: <T>(filterFalse?: boolean, filterZero?: boolean) => IterableIterator<T>;
  }
}

let arr = [ false, 'not null', null, 'abc', undefined, 5, 0, 6 ];

function filterNegatives<T = any>(filterFalse: boolean = false, filterZero: boolean = false): IterableIterator<T> {
  const originalArray = this;
  const length = originalArray.length - 1;
  return new (class implements IterableIterator<T> {

    private arrIndex = 0;

    private shouldFilterIndex(index: number) {
      if ((originalArray[index] == null || originalArray[index] == undefined)) {
        return true;
      }
      if (filterFalse && originalArray[index] === false || filterZero && originalArray[index] === 0) {
        return true;
      }
      return false;
    }
    
    public next(): IteratorResult<T> {
      while (this.arrIndex <= length && this.shouldFilterIndex(this.arrIndex)) {
        this.arrIndex++;
      }
      const done = this.arrIndex > length;
      return {
        done,
        value: done ? null : originalArray[this.arrIndex++],
      };
    }

    public forEach(func: (value: T, index: number, originalIndex?: number) => void): void {
      let index = 0;
      for (const value of this) {
        func(value, index++, this.arrIndex - 1);
      }
    }

    public toArray() {
      return [...this];
    }

    [Symbol.iterator](): IterableIterator<T> {
      return this;
    }
  });
}

function filterNegativesPropertyDefinition(filterFalse?: boolean, filterZero?: boolean) {
  return {
    enumerable: true,
    get() {
      if (filterFalse === undefined && filterZero === undefined) {
        return filterNegatives.bind(this);
      }
      return (filterNegatives.bind(this))(filterFalse, filterZero);
    },
    set: (): any => undefined
  };
}

Object.defineProperties(Array.prototype, {
  valids: filterNegativesPropertyDefinition(false, false),
  concretePositives: filterNegativesPropertyDefinition(true, false),
  positives: filterNegativesPropertyDefinition(true, true),
  filterNegation: filterNegativesPropertyDefinition()
});

console.log([...arr.valids]);

console.log([...arr.concretePositives]);

console.log([...arr.positives]);

console.log([...arr.filterNegation(false, true)]);
