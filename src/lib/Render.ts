import { Reelm } from "./Decorators";
import * as _ from 'lodash';

interface HTMLElementProxy extends HTMLElement {
  element: HTMLElement,
  setClass: ((...classes: Array<string>) => void),
  setStyle: ((style: string) => void)
}

enum AccessMethod {
  Function,
  Parameter
}

type Target = {
  new(...args: any[]): any;
  <T extends {new (...args: any[]): {}}>(component: T, ...classArgs: any[]): InstanceType<T>;
  access: AccessMethod,
  [key: string]: any
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
   public get(target: Target, prop: string): ((...args: Array<any>) => HTMLElementProxy | HTMLElement) | (HTMLElementProxy | HTMLElement) {
    // if (target.access === AccessMethod.Parameter) {
    //   return this.renderFunction(target, prop);
    // }
    return this.renderFunction(target, prop);
  }

  private renderFunction(target: Target, prop: string): ((...args: Array<any>) => HTMLElementProxy | HTMLElement) {
    return (...args: Array<any>): HTMLElementProxy | HTMLElement => {
      console.log(_.cloneDeep(args), prop);
      const isArgProxy = (typeof args[1] == 'function') || ((typeof args[1] == 'object') && (args[1].isProxy === true));
      if (args.length === 1) {
        // console.log(args[0] instanceof Reelm.WatchProp && (args[0] as any).original != undefined);
        // Create an element and assign a value to it, if the argument is not an array
        if (!(args[0] instanceof Array) && !args[0].isProxy && !(args[0] instanceof Reelm.WatchProp && args[0].value instanceof Array)) {          
          return this.attachCallsProxy(this.createElement(target, args[0], prop));
        }
        // If the argument is an array, assign it to the base argument and continue
        if (args[0] instanceof Array) {
          args = args[0];
        }
      }
      // If there are two arguments, an array of values and an element to create for the values
      if (args.length == 2 && isArgProxy && args[0] instanceof Array) {
        return this.createParentFromChildren(target, prop, args[0], args[1]);
      }
      // If the arguments are comprised of a mix of data, pass it to a recursive function
      // console.log(target, prop, args);
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
  private createParentFromChildren(target: Target, prop: string, values: Array<any>, nextElement: ((...args: Array<any>) => any)): (HTMLElementProxy | HTMLElement) {
    const base = this.createElement(target, "", prop);
    // Loop through the values and call the element to create with the value
    // when accessing a value we call the proxy's get method again to create an element with a value (or multiple values)
    const subElements = values.map(value => {
      return nextElement(value).element
    });
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
  private createParentFromValues(target: Target, prop: string, values: Array<any>): (HTMLElementProxy | HTMLElement) {
    const base = document.createElement(prop);
    values.forEach((curr: any | any[]) => {
      if (curr instanceof Object && curr instanceof HTMLElement) {
        curr = (curr as HTMLElementProxy).element;
      }
      // Create elements when the typeof the curr is not an object and not an html element
      if (!(curr instanceof HTMLElement) && typeof curr !== 'object') {
        curr = this.createElement(target, curr, prop);
      }
      // If the curr is an instance of Array, re-call the proxy with the last prop given
      if (curr instanceof Array) {
        curr = ((this.get(target, prop) as any)(curr) as HTMLElementProxy).element;
      }
      // If the element is a watch prop
      if (curr instanceof Reelm.WatchProp) {
        curr = Array.from(this.createElement(target, curr, prop).childNodes);
      }
      base.append(...(curr instanceof Array ? curr : [curr]));
    });
    return this.attachCallsProxy(base);
  }

  /**
   * Create a simple html element with the tag name and inner html
   * @param value the value to insert into the element
   * @param type the type of the element
   * @returns HTMLElement
   */
  private createElement(target: Target, value: any, type: string): HTMLElement {
    const el = document.createElement(type);
    let innerHtml = value;
    // If the argument passed in is a WatchProp, subscribe to changes
    if (value instanceof Reelm.WatchProp) {
      const watchPropValue = (watchProp: Reelm.WatchProp<typeof value.value>) => {
        if (watchProp.value instanceof Array) {
          // console.log((this.createParentFromValues(target, type, watchProp.value) as any).element);
          // return el.appendChild((this.createParentFromValues(target, type, watchProp.value) as any).element);
          return watchProp.value.reduce((prev: HTMLElement, child) => {
            console.log(child);
            prev.appendChild((() => {
              if (child.isProxy || child instanceof HTMLElement) {
                return child.element;
              }
              const newElement = document.createElement(type);
              newElement.innerHTML = child;
              return newElement;
            })());
            return prev;
          }, document.createElement('div')).innerHTML;
        }
        return value.value;
      }
      el.innerHTML = watchPropValue(value);
      const listenTo = (value as any).original != undefined ? (value as any).original : value;
      listenTo.onChange(((existingElement: any, newValue: any) => {
        //console.log(newValue, existingElement, target);
        console.log(listenTo.recreateWithSteps(listenTo.watchSymbol));
        existingElement.innerHTML = watchPropValue(newValue);
      }).bind(null, el));
      return el;
    }
    if (!!value) {
      el.replaceChildren((value instanceof Object && value.isProxy) ? value.element : innerHtml);
    }
    return el;
  }

  private attachCallsProxy(on: HTMLElement): (HTMLElement | HTMLElementProxy) {
    return new Proxy(on, new this.AttachedProxyHandler);
  }

  /**
   * Proxy being attached to the HTMLElement resolved from the render method
   */
  private AttachedProxyHandler = class implements ProxyHandler<any> {

    public set(target: HTMLElement, prop: keyof HTMLElement, receiver: any) {
      if ((this as any)[prop] != undefined) {
        return (this as any)[prop](target, prop, receiver)(receiver());
      }
      (target as any)[prop] = receiver;
      return true;
    }

    public get(target: HTMLElement, prop: keyof (HTMLElementProxy & HTMLElement) | string, receiver: any) {
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
      if (!(methods.includes(prop))) {
        if (typeof target[prop as keyof HTMLElement] == 'function') {
          return (...args: Array<any>) => {
            args = args.map(arg => {
              if (arg instanceof Reelm.WatchProp) {
                return arg.value;
              }
              return arg;
            });
            (target[prop as keyof HTMLElement] as Function)(...args);
            return receiver;
          }
        }
        return target[prop as keyof HTMLElement];
      }
      return ((this as any)[prop])(target, prop, receiver);
    }

    private listen(target: HTMLElement, prop: keyof (HTMLElementProxy & HTMLElement), receiver: any) {
      return (...args: Reelm.WatchProp<any>[]) => {
        for (const fn of args) {
          console.log(fn);
          fn.onChange(((existingElement: any, newValue: any) => {
            // console.log(existingElement, newValue);
            existingElement.innerHTML = newValue;
          }).bind(null, target));
        }
      }
    }

    private isProxy() {
      return true;
    }

    private element(target: HTMLElement, prop: keyof (HTMLElementProxy & HTMLElement), receiver: any) {
      return target;
    }

    private style(target: HTMLElement, prop: keyof (HTMLElementProxy & HTMLElement), receiver: any): any {
      return (args: string) => {
        let currentStyle = target.getAttribute('style') ?? "";
        currentStyle = (currentStyle == "" || currentStyle.slice(-1) == ';') ? currentStyle : `${currentStyle}; `;
        target.setAttribute('style', `${currentStyle}${args}`);
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
export const Render: Target = new Proxy({
  access: AccessMethod.Function,
  isProxy: true
} as unknown as Target, new RenderHandler);

export const Element = new Proxy({
  access: AccessMethod.Parameter,
  isProxy: true
} as unknown as Target, new RenderHandler);