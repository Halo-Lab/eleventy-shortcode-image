import path from 'path';

// @ts-ignore
import Image from '@11ty/eleventy-img';
import { OptimizeOptions } from 'svgo';

import { optimizeImage } from './image';
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
export const createImageShortcode = ({
  inputDirectory = path.join(
    DEFAULT_SOURCE_DIRECTORY_NAME,
    DEFAULT_ASSETS_DIRECTORY_NAME,
    DEFAULT_IMAGES_DIRECTORY_NAME
  ),
  outputDirectory = path.join(
    DEFAULT_BUILD_DIRECTORY_NAME,
    DEFAULT_IMAGES_DIRECTORY_NAME
  ),
  svgoOptions = {},
  rasterOptions = {},
}: ImageShortCodeOptions = {}) => async (
  src: string,
  { alt = '', title = '', classes = [] }: ImageAttributes = {}
): Promise<string> => {
  const classNames: ReadonlyArray<string> = Array.isArray(classes)
    ? classes
    : [classes];

  const input = path.resolve(inputDirectory, src);
  const output = path.resolve(outputDirectory, src);

  const [_, ...directories] = outputDirectory.split(path.sep);
  const publicDirectory =
    directories.length > 0 ? path.join(...directories) : '';

  const { metadata, data, isSVG } = optimizeImage({
    input,
    output,
    classNames,
    svgoOptions,
    rasterOptions,
    publicDirectory,
  });

  return isSVG
    ? data
    : Image.generateHTML(
        metadata,
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
