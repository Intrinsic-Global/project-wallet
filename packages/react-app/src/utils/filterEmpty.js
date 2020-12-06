const filterEmpty = xs => {
  if (xs == undefined) return [];
  if (xs.filter == undefined) {
    return [];
  }
  return xs.filter(
    x =>
      x.toString() != "0x0000000000000000000000000000000000000000" &&
      x.toString() != "0x0000000000000000000000000000000000000000000000000000000000000000" &&
      x.toString() != "",
  );
};

export default filterEmpty;
