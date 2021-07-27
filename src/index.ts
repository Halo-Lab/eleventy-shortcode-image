import { join } from 'path';

// @ts-ignore
import Image from '@11ty/eleventy-img';
import { OptimizeOptions } from 'svgo';
import { isNothing, memoize } from '@fluss/core';

import { log } from './logger';
import { converter } from './path_converter';
import { fetchImage } from './fetch_image';
import { writeImage } from './write_image';
import { optimizeSVG } from './optimize_svg';
import { getRasterOptimizerOptions } from './raster_optimizer_options';
import { AdditionalOptions, ImageProperties } from './types';
import { createImg, createPicture, Metadata } from './create_img';
import { getSrcsetName, normalizeImageAttributes } from './image_attributes';
import {
  DEFAULT_BUILD_DIRECTORY_NAME,
  DEFAULT_ASSETS_DIRECTORY_NAME,
  DEFAULT_IMAGES_DIRECTORY_NAME,
  DEFAULT_SOURCE_DIRECTORY_NAME,
} from './constants';

export interface ImageShortCodeOptions {
  /**
   * Path to directory where all images live.
   *
   * Should start from the _current working directory_.
   */
  readonly inputDirectory?: string;
  /**
   * Path to directory for optimized and transformed images.
   * First part of the path is meant to be the _output_ directory.
   *
   * Should start from the _current working directory_.
   */
  readonly outputDirectory?: string;
  /**
   * Options for [svgo](https://github.com/svg/svgo) package.
   * for subtle configuration of SVGs optimizations and some
   * additional options.
   */
  readonly svgoOptions?: OptimizeOptions & AdditionalOptions;
  /**
   * Options for [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) package.
   * Is is used for optimizations of raster images.
   * For more info see its documentation.
   */
  readonly rasterOptions?: Record<string, any>;
}

/** Creates `image` shortcode. */
export const createImageShortcode = ({
  inputDirectory = join(
    DEFAULT_SOURCE_DIRECTORY_NAME,
    DEFAULT_ASSETS_DIRECTORY_NAME,
    DEFAULT_IMAGES_DIRECTORY_NAME,
  ),
  outputDirectory = join(
    DEFAULT_BUILD_DIRECTORY_NAME,
    DEFAULT_IMAGES_DIRECTORY_NAME,
  ),
  svgoOptions = {},
  rasterOptions = {},
}: ImageShortCodeOptions = {}) =>
  memoize(
    async (
      src: string,
      { toHTML, ...attributes }: ImageProperties = {},
    ): Promise<string> => {
      // Gather information about an image.
      const source = converter(src, inputDirectory, outputDirectory);

      log(`Start optimizing "${source.rawInput}" file.`);

      // Download image if source is link.
      await fetchImage(source);

      if (source.isGIF) {
        // Don't wait for image writing.
        writeImage(source.sourcePath, source.outputPath)();

        return createImg(
          normalizeImageAttributes({
            ...attributes,
            src: source.publicURL,
          }),
        );
      }

      if (source.isSVG) {
        const classNames: ReadonlyArray<string> = Array.isArray(
          attributes.classes,
        )
          ? attributes.classes
          : isNothing(attributes.classes)
          ? []
          : [attributes.classes];

        const result = await optimizeSVG(
          source.sourcePath,
          classNames,
          svgoOptions,
        )();

        if (toHTML ?? svgoOptions.toHTML ?? false) {
          return result;
        } else {
          // We do not need to wait for image writing, because
          // we already have its public URL.
          writeImage(result, source.outputPath, true)();

          return createImg(
            normalizeImageAttributes({
              ...attributes,
              src: source.publicURL,
            }),
          );
        }
      }

      Image.concurrency = 40;

      const stats: Metadata = Image.statsSync(
        source.sourcePath,
        getRasterOptimizerOptions(source, rasterOptions),
      );

      // Do not wait for image compression ends - may seed up start time.
      Image(
        source.sourcePath,
        getRasterOptimizerOptions(source, rasterOptions),
      ).catch((error: Error) => log('Could not optimize image: %O', error));

      log(`Image "${source.rawInput}" is optimized. Stats:\n%O`, stats);

      return createPicture(
        stats,
        normalizeImageAttributes({
          ...attributes,
          src: source.publicURL,
        }),
        getSrcsetName(attributes.lazy, attributes.srcsetName),
      );
    },
    (src, properties = {}) => src + JSON.stringify(properties),
  );
