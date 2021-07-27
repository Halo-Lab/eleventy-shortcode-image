import { isNothing } from '@fluss/core';

const defaultAttributes = {
  loading: 'lazy',
  decoding: 'async',
};

export const normalizeImageAttributes = ({
  src,
  lazy,
  srcset,
  classes,
  srcName = 'data-src',
  srcsetName,
  ...attributes
}: Record<
  string,
  string | number | boolean | ReadonlyArray<string> | undefined
>) => {
  const classNames: ReadonlyArray<string | number> = Array.isArray(classes)
    ? classes
    : isNothing(classes)
    ? []
    : [classes];

  return {
    ...defaultAttributes,
    ...attributes,
    [lazy ? (srcName as string) : 'src']: src,
    [getSrcsetName(lazy as boolean, srcsetName as string)]: srcset,
    class: classNames.join(' '),
  };
};

export const getSrcsetName = (lazy: boolean = false, srcsetName?: string) =>
  lazy ? srcsetName ?? 'data-srcset' : 'srcset';
