import { extendDefaultPlugins } from 'svgo';

/** Build options for SVG optimizer. */
export const getVectorOptimizerOptions = (
  input: string,
  classNames: ReadonlyArray<string>
) => ({
  path: input,
  plugins: extendDefaultPlugins([
    {
      // @ts-ignore
      name: 'addClassesToSVGElement',
      active: classNames.length > 0,
      // @ts-ignore
      params: {
        classNames,
      },
    },
    // Preserve view-box attribute on <svg> for proper resizing of SVG
    // through CSS.
    {
      name: 'removeViewBox',
      active: false,
    },
    // Remove width and height attributes from <svg>
    {
      name: 'removeDimensions',
      active: true,
    },
    // Add name of SVG to id for create unique IDs if many SVGs will be present in page
    {
      name: 'prefixIds',
      active: true,
    },
  ]),
});
