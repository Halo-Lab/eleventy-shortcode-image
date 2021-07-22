import { promises } from 'fs';

import { pipe, tryCatch } from '@fluss/core';
import { optimize, OptimizedSvg, OptimizeOptions } from 'svgo';

import { log } from './logger';
import { AdditionalOptions } from './types';
import { getVectorOptimizerOptions } from './vector_optimizer_options';

export const optimizeSVG = (
  filePath: string,
  classNames: ReadonlyArray<string>,
  svgoOptions: OptimizeOptions & AdditionalOptions
) =>
  tryCatch(
    pipe(
      () => promises.readFile(filePath, { encoding: 'utf8' }),
      (data: string) =>
        optimize(
          data,
          getVectorOptimizerOptions(filePath, classNames, svgoOptions)
        ),
      ({ data }: OptimizedSvg) => data
    ),
    async (error: Error) => (
      log(`SVG optimization is failed with error.\n%O`, error), ''
    )
  );
