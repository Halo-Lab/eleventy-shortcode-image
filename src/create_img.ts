import { isJust, list, NArray } from '@fluss/core';

import { ImageProperties } from './types';

/** Creates \<img> string element. */
export const createImg = (
  attributes: Omit<ImageProperties, 'toHTML'>,
): string =>
  `<img ${Object.entries(attributes)
    .filter(([_, value]) => isJust(value))
    .reduce(
      (all, [name, value]) => all + ' ' + name + '="' + value + '"',
      '',
    )} />`;

interface ImageMetadata {
  readonly url: string;
  readonly size: number;
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly srcset: string;
  readonly filename: string;
  readonly ouputPath: string;
  readonly sourceType: string;
}

export interface Metadata {
  readonly [key: string]: ReadonlyArray<ImageMetadata>;
}

const last = <T extends ReadonlyArray<any>>(array: T): NArray.Last<T> =>
  array[array.length - 1];

const getImageMetadataOf = (
  metadata: Metadata,
  index: number,
): ReadonlyArray<ImageMetadata> => metadata[Object.keys(metadata)[index]];

export const createPicture = (
  metadata: Metadata,
  attributes: Omit<ImageProperties, 'toHTML'>,
  srcsetName: string,
): string => {
  // Image of the lowest quality and older format always goes first.
  const lowsrc = last(getImageMetadataOf(metadata, 0));

  return `<picture>
    ${
      list(Object.values(metadata)).chain(list).isEmpty()
        ? ''
        : Object.values(metadata)
            .reverse()
            .map(
              (imageFormat) =>
                `<source type="${
                  imageFormat[0].sourceType ?? ''
                }" ${srcsetName}="${imageFormat
                  .map(({ srcset }) => srcset)
                  .join(', ')}">`,
            )
            .join('\n')
    }
      ${createImg({
        src: lowsrc.url,
        width: lowsrc.width,
        height: lowsrc.height,
        ...attributes,
      })}
    </picture>`;
};
