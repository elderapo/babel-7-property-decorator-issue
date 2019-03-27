function fixPropertyDecorator<T extends Function>(decorator: T): T {
  return ((...args: any[]) => (
    target: any,
    propertyName: any,
    ...decoratorArgs: any[]
  ) => {
    decorator(...args)(target, propertyName, ...decoratorArgs);

    for (let arg of decoratorArgs) {
      if (!arg) {
        continue;
      }

      target[propertyName] = arg.initializer ? arg.initializer() : undefined;
    }

    return Object.getOwnPropertyDescriptor(target, propertyName);
  }) as any;
}

const LogUpdate = () => {
  return (target: Object, key: string | symbol) => {
    let val = target[key];

    const getter = () => {
      return val;
    };

    const setter = next => {
      console.log(`Updating: ${val} => ${next}...`);
      val = next;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
};

const LogUpdateFixed = fixPropertyDecorator(LogUpdate);

class Something {
  @LogUpdateFixed()
  public count: number = 0;
}

const something = new Something();
console.log("default", something.count);
something.count++;
something.count = 123;
something.count = -1;
