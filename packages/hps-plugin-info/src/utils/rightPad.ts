export const rightPad = (name: string, length: number) => {
  while (name.length < length) {
    name = name.concat(' ');
  }
  return name;
};
