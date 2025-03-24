/**
 * Retrieves a nested property value from an object using a dot-separated path string.
 *
 * @param currentState - The object to traverse.
 * @param path - A dot-separated string representing the nested property path.
 * @returns The value at the specified path, or `undefined` if the path is invalid.
 */
const getPropPathValue = <T extends object>(currentState: T, path: string): unknown => {
  const keys = path.split('.');

  return keys.reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, currentState as unknown);
};

export default getPropPathValue;
