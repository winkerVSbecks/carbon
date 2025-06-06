/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @param {string} name The name of the prop that must exist to validate
 * the current prop.
 * @param {React.Validator} propType The original prop type checker.
 * @returns {React.Validator} The new prop type checker for the current prop that
 * becomes required if the prop corresponding to the provided prop name exists.
 */
export default function requiredIfGivenPropIsTruthy(name, propType) {
  return function check(props, propName, componentName, ...rest) {
    if (
      process.env.NODE_ENV !== 'production' &&
      props[name] == true &&
      props[propName] == null
    ) {
      return new Error(
        `You must provide a value for \`${propName}\` in \`${componentName}\` if \`${name}\` exists.`
      );
    }
    return propType(props, propName, componentName, ...rest);
  };
}
