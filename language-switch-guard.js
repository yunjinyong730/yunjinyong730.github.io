(() => {
  "use strict";

  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "placeholder");
  if (!descriptor?.get || !descriptor?.set) return;

  Object.defineProperty(HTMLInputElement.prototype, "placeholder", {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value) {
      const next = String(value ?? "");
      if (descriptor.get.call(this) === next) return;
      descriptor.set.call(this, next);
    },
  });
})();
