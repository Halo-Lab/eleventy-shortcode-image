/** Checks if text is URL. */
export const isUrl = (text: string): boolean => {
  try {
    // If text is not URL then error will be thrown.
    // https://developer.mozilla.org/en-US/docs/Web/API/URL
    new URL(text);
    return true;
  } catch (error) {
    return false;
  }
};
