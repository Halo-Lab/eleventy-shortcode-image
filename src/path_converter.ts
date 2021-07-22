import path from 'path';

import { tryCatch } from '@fluss/core';

import { isGif, isSVG } from './image_formats';
import { URL_DELIMITER } from './constants';

const isUrl = tryCatch(
  // If text is not URL then error will be thrown.
  // https://developer.mozilla.org/en-US/docs/Web/API/URL
  (text: string) => (new URL(text), true),
  () => false
);

const prependURLDelimiter = (to: string): string =>
  to.startsWith(URL_DELIMITER) ? to : URL_DELIMITER + to;

interface SourceBase {
  readonly name: string;
  readonly rawInput: string;
  readonly extension: string;
  readonly publicURL: string;
  readonly publicDir: string;
  readonly sourcePath: string;
  readonly sourceDir: string;
  readonly outputPath: string;
  readonly outputDir: string;
  readonly sourcePrefix: string;
  readonly outputPrefix: string;
  readonly relativeOutputDir: string;
  readonly relativeOutputPath: string;

  readonly isSVG: boolean;
  readonly isGIF: boolean;
}

interface SourceUrl extends SourceBase {
  readonly isURL: true;
  readonly sourceUrl: string;
}

interface SourcePath extends SourceBase {
  readonly isURL: false;
}

export type Source = SourceUrl | SourcePath;

const urlToPath = (source: string, to: string): string =>
  path.join(
    to,
    new URL(source).pathname.slice(1).split(URL_DELIMITER).join(path.sep)
  );

export const converter = (
  text: string,
  sourcePrefix: string,
  outputPrefix: string
): Source => {
  const absoluteSourcePrefix = path.resolve(sourcePrefix);
  const absoluteOutputPrefix = path.resolve(outputPrefix);

  const isURL = isUrl(text);

  const sourcePath = isURL
    ? urlToPath(text, absoluteSourcePrefix)
    : path.resolve(sourcePrefix, text);
  const outputPath = isURL
    ? urlToPath(text, path.resolve(outputPrefix))
    : path.resolve(outputPrefix, text);
  const relativeOutputPath = outputPath.replace(process.cwd(), '.');

  const publicURL = prependURLDelimiter(
    outputPath
      .replace(
        absoluteOutputPrefix,
        outputPrefix.split(path.sep).slice(1).join(path.sep)
      )
      .replace(new RegExp(path.sep, 'g'), URL_DELIMITER)
  );
  const extension = path.extname(sourcePath).slice(1);

  return {
    sourcePrefix,
    outputPrefix,
    rawInput: text,
    isURL: isURL,
    sourcePath,
    sourceDir: path.dirname(sourcePath),
    // @ts-ignore
    sourceUrl: isURL ? text : undefined,
    outputPath,
    relativeOutputPath,
    relativeOutputDir: path.dirname(relativeOutputPath),
    publicURL,
    publicDir: publicURL.split(URL_DELIMITER).slice(0, -1).join(URL_DELIMITER),
    isGIF: isGif(text),
    isSVG: isSVG(text),
    extension,
    outputDir: path.dirname(outputPath),
    name: path.basename(
      sourcePath.split(path.sep).slice(-1)[0],
      '.' + extension
    ),
  };
};
