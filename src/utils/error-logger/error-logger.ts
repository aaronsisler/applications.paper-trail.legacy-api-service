/* eslint-disable no-console */
const errorLogger = (caller: string, errorMessage: string): void => {
  console.warn(`ERROR: ${caller}`);
  console.warn(errorMessage);
};

export { errorLogger };
