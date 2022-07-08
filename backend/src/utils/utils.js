// Return a new array with the element removed
Array.prototype.removed = function (element) {
  return this.filter((e) => {
    return e != element;
  });
};
