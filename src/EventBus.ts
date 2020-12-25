/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
export class EventBus {
  clientList: Record<string, Array<Function>>

  constructor () {
    this.clientList = {}
  }

  on (key: string, fn: Function) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  }

  emit (...args: [string, ...unknown[]]) {
    const key = Array.prototype.shift.call(args);
    const fns = this.clientList[key];
    if (!fns || fns.length === 0) {
      return false;
    }

    fns.forEach((fn) => {
      fn.apply(this, args);
    });
    return false;
  }

  remove (key: string, fn: Function) {
    const fns = this.clientList[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      if (fns) {
        fns.length = 0;
      }
    } else {
      for (let l = fns.length - 1; l >= 0; l -= 1) {
        const func = fns[l];
        if (func === fn) {
          fns.splice(l, 1);
        }
      }
    }
    return false;
  }
}
