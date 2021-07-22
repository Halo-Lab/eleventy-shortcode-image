import fs from 'fs';
import path from 'path';

import { pipe, sequentially } from '@fluss/core';

/**
 * Writes image from _sourcePath_ to _outputPath_.
 * If image is located in-memory, then _sourcePath_
 * should be image data and _isData_ need to be `true`.
 */
export const writeImage = (
  source: string,
  outputPath: string,
  isData = false
) =>
  sequentially(
    () => fs.promises.mkdir(path.dirname(outputPath), { recursive: true }),
    pipe(
      () => (isData ? source : fs.promises.readFile(source)),
      (data: Buffer) => fs.promises.writeFile(outputPath, data)
    )
  );
