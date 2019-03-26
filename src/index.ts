import "@abraham/reflection";

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

class Something {
  @LogUpdate()
  public count: number = 0;
}

const something = new Something();
something.count++;
something.count = 123;
something.count = -1;
