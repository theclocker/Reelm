const permissions: {[k: string]: boolean} = {
  'get/users': true,
  'get/purchases': false,
};

class Users {
  @callable('get/users')
  async user(id: String, p?: Awaited<Promise<any>>) {
    const res = await p!(id);
    console.log(res);
  }

  @callable('get/purchases')
  async purchases(userId: String, p?: Awaited<Promise<any>>) {
    console.log('users purchases');
    const purchases = await p!(userId);
    console.log(purchases);
  }
}

@service
class Pets {
  @callable('get/purchases')
  async purchases(userId: String, p?: Awaited<Promise<any>>) {
    console.log('pets purchases');
    const purchases = await p!(userId);
    console.log(purchases);
  }
}

function service<T extends {new (...args: any[]): any}>(constructor: T) {
  const newConstructor = new (class extends constructor {});
  const newPrototype = Object.getPrototypeOf(newConstructor);
  for (const funcName in constructor.prototype) {
    const isDecorated = !!(constructor.prototype[funcName].prototype || {}).callableDecorated;
    const url = isDecorated && constructor.prototype[funcName].prototype.callableUrl;
    if (!url) continue;
    if (!permissions[url]) {
      newPrototype[funcName] = undefined;
    }
  }
  Object.setPrototypeOf(newConstructor, newPrototype);
  return newConstructor.constructor;
}

function callable(url: string, fetchArgs: {[k: string]: any} = {}): Function {
  const isDenied = !permissions[url];
  // Create a promise to call
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const targetFunction = target[key].bind(target);
    // The reason for using a function here, rather than an arrow function, is to preserve binding to the target
    descriptor.value = (function(...args: any[]) {
      // if undefined OR false returns a rejection promise
      if (isDenied) return Promise.reject(new Error(`Permission Denied for: '${url}'`));
      // Instead of promise, create a fetch function here
      return targetFunction(...args, (...args: any[]) => {
        new Promise((res: Function, rej: Function) => {
          setTimeout(() => { res(' >> Response from promise') }, 1000);
        })
      });
    });
    descriptor.value.prototype = {...(descriptor.value.prototype || {}), callableDecorated: true, callableUrl: url};
  }
}

const usersService = new Users();
(async () => {
  await usersService.user('123');
  try {
    await usersService.purchases('456');
  } catch (e: Error | any) {
    console.error(e.message);
  }
})();

const petsService = new Pets();
console.log(petsService, Object.getPrototypeOf(petsService));
petsService.purchases('678');