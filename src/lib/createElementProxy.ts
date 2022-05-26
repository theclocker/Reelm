const ElementCreator: {[k in keyof HTMLElementTagNameMap]: HTMLElement} = new Proxy({} as any, {
  get(t: any, p: any) {
    return `<${p}></${p}>`;
  }
});

const someObj = {
  something: 123
};

const SomethingProxy = new Proxy(someObj, {
  get(target: typeof someObj, property: keyof typeof someObj) {
    if (property === 'something') {
      return 'You cant access something';
    }
    return target[property] * 2;
  }
});

const someRandomDiv = ElementCreator.div;
console.log(someRandomDiv);
console.log(SomethingProxy.something);

export default SomethingProxy;