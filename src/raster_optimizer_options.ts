import { sep, extname } from 'path';

import { isUrl } from './is_url';
import { URL_DELIMITER } from './constants';
import { buildImageName } from './image_name';
import { getImageFormatsFrom } from './image_formats';

/** Build options for raster image optimizer. */
export const getRasterOptimizerOptions = (
  input: string,
  outputDirectory: string,
  options: object = {}
) => ({
  widths: [null],
  svgShortCircuit: true,
  formats:
    // Before downloading image we don't know its type,
    // so by default we will convert it into default formats.
    getImageFormatsFrom(isUrl(input) ? '' : extname(input).slice(1)),
  outputDir: outputDirectory,
  urlPath:
    URL_DELIMITER + outputDirectory.split(sep).slice(1).join(URL_DELIMITER),
  sharpPngOptions: {
    quality: 100,
    progressive: true,
  },
  sharpJpegOptions: {
    quality: 100,
    progressive: true,
  },
  sharpWebpOptions: {
    quality: 100,
    // Use near_lossless compression mode.
    nearLossLess: true,
  },
  sharpAvifOptions: {
    quality: 100,
  },
  filenameFormat: (
    id: string,
    src: string,
    width: string,
    format: string,
    options: object
  ) => buildImageName(input, src, format),
  ...options,
});
