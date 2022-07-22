export function elementRemoved(array, element) {
  return array.filter((e) => {
    return e != element;
  });
}
