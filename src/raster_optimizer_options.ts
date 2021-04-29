import { getImageFormatsFrom } from './image_formats';

/** Build options for raster image optimizer. */
export const getRasterOptimizerOptions = (
  extension: string,
  outputDirectory: string,
  publicDirectory: string,
  options: object = {}
) => ({
  widths: [null],
  formats: getImageFormatsFrom(extension),
  outputDir: outputDirectory,
  urlPath: publicDirectory,
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
  ...options,
});
