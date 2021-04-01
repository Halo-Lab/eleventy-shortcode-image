import fs from 'fs';

import { optimize } from 'svgo';

import { SVG_CLASS_REGEXP } from './constants';
import { getVectorOptimizerOptions } from './vector_optimizer_options';

/**
 * Optimizes SVG and write it do disk.
 * Returns memory copy of SVG.
 */
export const optimizeSVG = (
  input: string,
  output: string,
  classNames: ReadonlyArray<string> = []
) =>
  // For optimal work we need to check if we already did it
  // with _input_ SVG. If so - just return it.
  // TODO: maybe we should cache images in memory?
  fs.existsSync(output)
    ? fs.promises
        .readFile(output, { encoding: 'utf-8' })
        .then((data) =>
          data.search(SVG_CLASS_REGEXP) > -1
            ? data.replace(SVG_CLASS_REGEXP, (match, names) =>
                match.replace(names, classNames.join(' '))
              )
            : data.replace('<svg', `$& class="${classNames.join(' ')}"`)
        )
    : fs.promises
        .readFile(input, { encoding: 'utf-8' })
        .then((source) =>
          optimize(source, getVectorOptimizerOptions(input, classNames))
        )
        .then(async ({ data }) => {
          await fs.promises.writeFile(output, data, { encoding: 'utf-8' });
          return data;
        });
