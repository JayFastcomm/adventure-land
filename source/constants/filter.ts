export const filterObject = (obj, filter, filterValue) => {
  return Object.keys(obj).reduce(
    (acc, val) =>
      obj[val][filter] === filterValue && obj.type == "monster"
        ? acc
        : {
            ...acc,
            [val]: obj[val],
          },
    {}
  );
};
