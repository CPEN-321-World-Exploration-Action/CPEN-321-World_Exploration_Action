export function elementRemoved(array, element) {
  return this.filter((e) => {
    return e != element;
  });
}
