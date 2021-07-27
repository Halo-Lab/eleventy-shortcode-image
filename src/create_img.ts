import { isJust } from '@fluss/core';

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

export const createPicture = (
  metadata: Metadata,
  attributes: Omit<ImageProperties, 'toHTML'>,
  srcsetName: string,
): string =>
  `<picture>
    ${Object.values(metadata)
      .reverse()
      .map(
        (imageFormat) =>
          `<source type="${
            imageFormat[0].sourceType
          }" ${srcsetName}="${imageFormat
            .map(({ srcset }) => srcset)
            .join(', ')}">`,
      )
      .join('\n')}
      ${createImg(attributes)}
    </picture>`;
