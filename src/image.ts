import path from 'path';

// @ts-ignore
import Image from '@11ty/eleventy-img';
import { OptimizeOptions } from 'svgo';

import { optimizeSVG } from './optimize_svg';
import { makeDirectories } from './mkdir';
import { getRasterOptimizerOptions } from './raster_optimizer_options';

interface OptimizeImageOptions {
  /** Path to image in source's images directory. */
  input: string;
  /** Path to image in build's images directory. */
  output: string;
  /** Classes to be added to SVG. */
  classNames: ReadonlyArray<string>;
  svgoOptions?: OptimizeOptions;
  rasterOptions?: Record<string, any>;
  /** Path from current working directory to _images_ directory. */
  outputDirectory: string;
  /** Path from _output_ directory to _images_ directory. */
  publicDirectory: string;
}

interface ImageMetadata {
  /** Optimized SVG. */
  data: Promise<string>;
  isSVG: boolean;
  /** Image's metadata */
  metadata: object;
}

/**
 * Gets metadata about image. This function defines options for sharp
 * package for generating optimized images.
 */
export const optimizeImage = ({
  input,
  output,
  classNames,
  svgoOptions = {},
  rasterOptions = {},
  outputDirectory,
  publicDirectory,
}: OptimizeImageOptions): ImageMetadata => {
  // Extension name without `.`.
  const extension = path.extname(input).slice(1);
  const isSVG = extension === 'svg';

  const options = getRasterOptimizerOptions(
    extension,
    outputDirectory,
    publicDirectory,
    rasterOptions
  );

  const optimizedImage = makeDirectories(path.dirname(output)).then(() =>
    // Though Image function can accept SVGs, but it does not optimize them.
    // So, we need to filter SVG and handle them separately.
    isSVG
      ? optimizeSVG(input, output, classNames, svgoOptions)
      : (Image(input, options), '')
  );

  return {
    data: optimizedImage,
    isSVG,
    metadata: Image.statsSync(input, options),
  };
};
