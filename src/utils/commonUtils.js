module.exports = (fn) => (request, response, next) => {
  fn(request, response, next).catch(next);
};

exports.filterInputRequest = (object, ...allowedFields) => {
  const filteredObject = {};
  Object.keys(object).forEach((currentElement) => {
    if (allowedFields.includes(currentElement)) {
      filteredObject[currentElement] = object[currentElement];
    }
  });
  return filteredObject;
};
