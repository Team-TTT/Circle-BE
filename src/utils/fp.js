const reduce = (fn, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const item of iter) {
    acc = fn(acc, item);
  }

  return acc;
};

const go = (...args) => reduce((item, fn) => fn(item), args);

module.exports = {
  go,
  reduce,
};
