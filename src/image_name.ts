import { basename, extname } from 'path';

import { isUrl } from './is_url';

/**
 * Build name of image file based on its input path (it can be either
 * URL or path in file system), _sourcePath_ (it will be used enstead
 * of _input_ if latter is not an URL), and _extension_.
 * We should not extract extension name from _input_ or _sourcePath_
 * because some URLs cannot have extension in filename.
 */
export const buildImageName = (
  input: string,
  sourcePath: string,
  extension: string
): string =>
  (isUrl(input)
    ? // Pathname always contains leading slash.
      new URL(input).pathname.slice(1)
    : basename(sourcePath, extname(sourcePath))) + `.${extension}`;
