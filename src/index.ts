import { join } from 'path';

// @ts-ignore
import Image from '@11ty/eleventy-img';
import { memoize } from '@fluss/core';
import { OptimizeOptions } from 'svgo';

import { log } from './logger';
import { converter } from './path_converter';
import { createImg } from './create_img';
import { fetchImage } from './fetch_image';
import { writeImage } from './write_image';
import { optimizeSVG } from './optimize_svg';
import { AdditionalOptions } from './types';
import { getRasterOptimizerOptions } from './raster_optimizer_options';
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

export interface ImageAttributes {
  /** Alternative text for <img>. */
  alt?: string;
  /** Title for <img>. */
  title?: string;
  /** Class names for <img>. */
  classes?: string | ReadonlyArray<string>;
}

/** Creates `image` shortcode. */
export const createImageShortcode = ({
  inputDirectory = join(
    DEFAULT_SOURCE_DIRECTORY_NAME,
    DEFAULT_ASSETS_DIRECTORY_NAME,
    DEFAULT_IMAGES_DIRECTORY_NAME
  ),
  outputDirectory = join(
    DEFAULT_BUILD_DIRECTORY_NAME,
    DEFAULT_IMAGES_DIRECTORY_NAME
  ),
  svgoOptions = {},
  rasterOptions = {},
}: ImageShortCodeOptions = {}) =>
  memoize(
    async (
      src: string,
      { alt = '', title = '', classes = [] }: ImageAttributes = {}
    ): Promise<string> => {
      const classNames: ReadonlyArray<string> = Array.isArray(classes)
        ? classes
        : [classes];

      // Gather information about an image.
      const source = converter(src, inputDirectory, outputDirectory);

      log(`Start optimizing "${source.rawInput}" file.`);

      // Download image if source is link.
      await fetchImage(source);

      if (source.isGIF) {
        // Don't wait for image writing.
        writeImage(source.sourcePath, source.outputPath)();

        return createImg({
          src: source.publicURL,
          class: classNames.join(' '),
          alt,
          title,
          loading: 'lazy',
          decoding: 'async',
        });
      }

      if (source.isSVG) {
        const result = await optimizeSVG(
          source.sourcePath,
          classNames,
          svgoOptions
        )();

        if (svgoOptions.toHTML ?? false) {
          return result;
        } else {
          // We do not need to wait for image writing, because
          // we already have its public URL.
          writeImage(result, source.outputPath, true)();

          return createImg({
            src: source.publicURL,
            class: classNames.join(' '),
            alt,
            title,
            loading: 'lazy',
            decoding: 'async',
          });
        }
      }

      Image.concurrency = 40;

      const stats = Image.statsSync(
        source.sourcePath,
        getRasterOptimizerOptions(source, rasterOptions)
      );

      // Do not wait for image compression ends - may seed up start time.
      Image(
        source.isURL ? source.sourceUrl : source.sourcePath,
        getRasterOptimizerOptions(source, rasterOptions)
      ).catch((error: Error) => log('Could not optimize image: %O', error));

      log(`Image "${source.rawInput}" is optimized. Stats:\n%O`, stats);

      return Image.generateHTML(
        stats,
        {
          alt,
          title,
          class: classNames.join(' '),
          // Experimental technology: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading
          loading: 'lazy',
          decoding: 'async',
        },
        {
          // Strip the whitespace from the output of the `<picture>` element.
          whitespaceMode: 'inline',
        }
      );
    }
  );
