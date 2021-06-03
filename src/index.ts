import { join, resolve } from 'path';

// @ts-ignore
import Image from '@11ty/eleventy-img';
import { OptimizeOptions } from 'svgo';

import { log } from './logger';
import { isUrl } from './is_url';
import { optimizeSVG } from './optimize_svg';
import { getPublicPath } from './public_path';
import { getRasterOptimizerOptions } from './raster_optimizer_options';
import {
  SVG_NAME,
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
  inputDirectory?: string;
  /**
   * Path to directory for optimized and transformed images.
   * First part of the path is meant to be the _output_ directory.
   *
   * Should start from the _current working directory_.
   */
  outputDirectory?: string;
  /**
   * Options for [svgo](https://github.com/svg/svgo) package.
   * for subtle configuration of SVGs optimizations.
   */
  svgoOptions?: OptimizeOptions;
  /**
   * Options for [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) package.
   * Is is used for optimizations of raster images.
   * For more info see its documentation.
   */
  rasterOptions?: Record<string, any>;
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
export const createImageShortcode =
  ({
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
  async (
    src: string,
    { alt = '', title = '', classes = [] }: ImageAttributes = {}
  ): Promise<string> => {
    const classNames: ReadonlyArray<string> = Array.isArray(classes)
      ? classes
      : [classes];

    const input = isUrl(src) ? src : resolve(inputDirectory, src);

    log(`Start optimizing "${input}" file.`);

    const stats = await Image(
      input,
      getRasterOptimizerOptions(
        input,
        getPublicPath(input, inputDirectory, outputDirectory),
        rasterOptions
      )
    ).catch((error: Error) => log('Could not optimize image: %O', error));

    log(`Image "${input}" is optimized. Stats:\n%O`, stats);

    return SVG_NAME in stats
      ? optimizeSVG(
          resolve(stats[SVG_NAME][0].outputPath),
          classNames,
          svgoOptions
        )
      : Image.generateHTML(
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
  };
