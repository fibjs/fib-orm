exports.lowerCaseColumn = function (column) {
  const newCol = {}
  Object.entries(column).forEach(function ([key, value]) {
      newCol[key.toLocaleLowerCase()] = value;
      return newCol;
  });
  return newCol;
}