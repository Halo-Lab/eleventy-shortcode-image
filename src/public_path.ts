import { sep, join, dirname } from 'path';

/** Adds directory leading and trailing separator to directory. */
export const directoryWithBoundaries = (name: string): string =>
  name.startsWith(sep)
    ? name.endsWith(sep)
      ? name
      : name + sep
    : directoryWithBoundaries(sep + name);

/**
 * Gets public directories for image.
 * If image is downloaded from Web, then it has not any directory.
 * In that case we should return just output directory.
 */
export const getPublicPath = (
  sourcePath: string,
  inputDirectory: string,
  outputDirectory: string
): string =>
  join(
    outputDirectory,
    sourcePath.includes(directoryWithBoundaries(inputDirectory))
      ? dirname(
          // Directory will start withoud leading directory separator, so we should
          // add it manually for proper dirname work.
          sep + sourcePath.split(directoryWithBoundaries(inputDirectory))[1]
        )
      : ''
  );
