/**
 * @description - get description
 * @async
 *
 * @param {string} descriptionString - Description string
 * @param {string} length - Description length
 *
 * @returns {string}
 */
export const description = (descriptionString, length) => {
  if (length < descriptionString.length) {
    return descriptionString.substr(0, length).concat('...');
  }
  return descriptionString.substr(0, length);
};
