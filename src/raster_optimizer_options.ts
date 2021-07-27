import { Source } from './path_converter';
import { getImageFormatsFrom } from './image_formats';

const buildImageName = (source: Source, extension: string): string =>
  source.name + `.${extension}`;

/** Build options for raster image optimizer. */
export const getRasterOptimizerOptions = (
  source: Source,
  options: object = {},
) => ({
  widths: [null],
  svgShortCircuit: true,
  formats:
    // Before downloading image we don't know its type,
    // so by default we will convert it into default formats.
    getImageFormatsFrom(source.extension),
  outputDir: source.relativeOutputDir,
  urlPath: source.publicDir,
  sharpPngOptions: {
    // This value is recommended by Google developers.
    // [here](https://web.dev/use-imagemin-to-compress-images/)
    quality: 85,
    progressive: true,
  },
  sharpJpegOptions: {
    // This value is recommended by Google developers.
    // [here](https://web.dev/use-imagemin-to-compress-images/)
    quality: 85,
    progressive: true,
  },
  sharpWebpOptions: {
    quality: 85,
    // Use near_lossless compression mode.
    nearLossLess: true,
  },
  sharpAvifOptions: {
    quality: 85,
  },
  filenameFormat: (
    id: string,
    src: string,
    width: string,
    format: string,
    options: object,
  ) => buildImageName(source, format),
  ...options,
});
