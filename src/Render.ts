
interface HTMLElementProxy extends HTMLElement {
  element: HTMLElement,
  setClass: ((...classes: Array<string>) => void),
  setStyle: ((style: string) => void)
}

/**
 * The render proxy handler that intercepts calls to the Render proxy and creates HTML Elements recursively
 */
class RenderHandler implements ProxyHandler<any> {
  /**
   * Render HTML elements and return them based on the property accessed on the proxy and the values passed
   * @param target An empty object of type any to intercept any property with any name
   * @param prop An html tag name
   * @returns function that renders html elements based on the values and prop passed
   */
  get(target: any, prop: string): ((...args: Array<any>) => HTMLElementProxy | HTMLElement) | boolean {
    console.log(prop);
    if (prop === 'isProxy') {
      return true;
    }
    return (...args: Array<any>): HTMLElementProxy | HTMLElement => {
      if (prop == 'th') {
        console.log(123);
        console.log(target.isProxy);
        console.log(target, args);
      }
      if (args.length === 1) {
        // Create an element and assign a value to it, if the argument is not an array
        if (!(args[0] instanceof Array)) return this.attachCallsProxy(this.createElement(args[0], prop));
        // If the argument is an array, assign it to the base argument and continue
        args = args[0];
      }
      if (prop == 'thead') {
        console.log(args);
      }
      // If there are two arguments, an array of values and an element to create for the values
      if (args.length == 2 && (typeof args[1] == 'function' || args[1].isProxy) && args[0] instanceof Array) {
        return this.createParentFromChildren(prop, args[0], args[1]);
      }
      // If the arguments are comprised of a mix of data, pass it to a recursive function
      return this.createParentFromValues(target, prop, args);
    };
  }

  /**
   * Creates HTML Elements given an array of values to create HTML Elements for and the type of element to create
   * @param prop The parent's html tag to create
   * @param values The children to create the elements for
   * @param nextElement The next element of the proxy to create
   * @returns The final HTML Element created from the children and the next element function
   */
  private createParentFromChildren(prop: string, values: Array<any>, nextElement: ((...args: Array<any>) => any)): (HTMLElementProxy | HTMLElement) {
    const base = this.createElement("", prop);
    // Loop through the values and call the element to create with the value
    // when accessing a value we call the proxy's get method again to create an element with a value (or multiple values)
    const subElements = values.map(value => nextElement(value).element);
    base.append(...subElements);
    return this.attachCallsProxy(base);
  }

  /**
   * Given values and a prop, creates elements recursively
   * @param target The proxy target
   * @param prop The Parent HTML Element's tag to create
   * @param values The values to create the elements with
   * @returns The parent HTML Element that was created
   */
  private createParentFromValues(target: any, prop: string, values: Array<any>): (HTMLElementProxy | HTMLElement) {
    const base = this.createElement("", prop);
    values.forEach((curr) => {
      if (curr instanceof Object && curr instanceof HTMLElement) {
        curr = (curr as HTMLElementProxy).element;
      }
      // Create elements when the typeof the curr is not an object and not an html element
      if (!(curr instanceof HTMLElement) && typeof curr !== 'object') {
        curr = this.createElement(curr, prop);
      }
      // If the curr is an instance of Array, re-call the proxy with the last prop given
      if (curr instanceof Array) {
        curr = ((this.get(target, prop) as any)(curr) as HTMLElementProxy).element;
      }
      base.appendChild(curr);
    });
    return this.attachCallsProxy(base);
  }

  /**
   * Create a simple html element with the tag name and inner html
   * @param value the value to insert into the element
   * @param type the type of the element
   * @returns HTMLElement
   */
  private createElement(value: any, type: string): HTMLElement {
    const el = document.createElement(type);
    el.innerHTML = value;
    return el;
  }

  private attachCallsProxy(on: HTMLElement): (HTMLElement | HTMLElementProxy) {
    return new Proxy(on, new this.AttachedProxyHandler);
  }

  private AttachedProxyHandler = class implements ProxyHandler<any> {

    public get(target: HTMLElement, prop: keyof (HTMLElementProxy & HTMLElement) | string, receiver: any) {
      // console.log(prop, (this as any)[prop] != undefined);
      if ((this as any)[prop] == undefined) {
        if (typeof target[prop as keyof HTMLElement] == 'function') {
          return (...args: Array<any>) => {
            (target[prop as keyof HTMLElement] as Function)(...args);
            return receiver;
          }
        }
        return target[prop as keyof HTMLElement];
      }
      return ((this as any)[prop])(target, prop, receiver);
    }

    private element(target: HTMLElement, prop: keyof (HTMLElementProxy & HTMLElement), receiver: any) {
      return target;
    }

    private style(target: HTMLElement, prop: keyof (HTMLElementProxy & HTMLElement), receiver: any): any {
      return (args: string) => {
        target.setAttribute('style', args);
        return receiver;
      }
    }

    private class(target: HTMLElement, prop: keyof (HTMLElementProxy & HTMLElement), receiver: any): any {
      return (args: Array<string>) => {
        target.setAttribute('class', args.reduce((prev, curr) => `${prev} ${curr}`, ""));
        return this.get(target, prop, receiver);
      }
    }
  }
}

// Export a proxy for the user, using the proxyHandler
export const Render = new Proxy({}, new RenderHandler);