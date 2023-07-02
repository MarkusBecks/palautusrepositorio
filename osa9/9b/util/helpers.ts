const add = (a: number, b: number): number => {
  return a + b;
};

// check if all arguments are numbers
const areAllNumbers = (args: string[]): boolean => {
  for (const arg of args) {
    if (isNaN(Number(arg))) {
      return false;
    }
  }
  return true;
};

const isNumberArray = (arr: number[]): boolean => {
  return Array.isArray(arr) && arr.every((value) => !isNaN(value));
};

export { add, areAllNumbers, isNumberArray };
