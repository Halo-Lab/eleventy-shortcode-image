import { promises } from 'fs';

import { optimize, OptimizeOptions } from 'svgo';

import { log } from './logger';
import { getVectorOptimizerOptions } from './vector_optimizer_options';

export const optimizeSVG = (
  filePath: string,
  classNames: ReadonlyArray<string>,
  svgoOptions: OptimizeOptions
): Promise<string> =>
  promises
    .readFile(filePath, {
      encoding: 'utf8',
    })
    .then((source) =>
      optimize(
        source,
        getVectorOptimizerOptions(filePath, classNames, svgoOptions)
      )
    )
    .then(({ data }) => data)
    .catch(
      (error: Error) => (
        log(`SVG optimization is failed with error.\n%O`, error), ''
      )
    );
