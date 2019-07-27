const checkAllValuesIsNull = object => {
  let result = true;
  const arrayValues = Object.values(object);
  arrayValues.forEach(value => {
    if (value != null || value != undefined) {
      result = false;
    }
  });
  return result;
};
export { checkAllValuesIsNull };
