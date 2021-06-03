import { sep, join } from 'path';

import { directoryWithBoundaries, getPublicPath } from '../src/public_path';

describe('getPublicPath', () => {
  it('should return public directories of absolute path to file starting from output directory', () => {
    const sourcePath =
      sep + join('some', 'path', 'to', 'subdirectory', 'file.md');
    const inputDirectory = 'to';
    const outputDirectory = 'build';

    expect(getPublicPath(sourcePath, inputDirectory, outputDirectory)).toBe(
      join(outputDirectory, 'subdirectory')
    );
  });

  it('should return public directories for relative path to file starting from output directory', () => {
    const sourcePath = join('some', 'path', 'to', 'deep', 'very', 'file.md');
    const inputDirectory = 'to';
    const outputDirectory = 'output';

    expect(getPublicPath(sourcePath, inputDirectory, outputDirectory)).toBe(
      join(outputDirectory, 'deep', 'very')
    );
  });

  it('should return just output directory if source is downloaded from internet', () => {
    const sourcePath = 'some-hash-of-file';
    const inputDirectory = 'to';
    const outputDirectory = 'build';

    expect(getPublicPath(sourcePath, inputDirectory, outputDirectory)).toBe(
      outputDirectory
    );
  });
});

describe('directoryWithBoundaries', () => {
  it('should add leading and trailing separator to directory name', () => {
    const directoryName = 'dir';

    expect(directoryWithBoundaries(directoryName)).toBe(
      sep + directoryName + sep
    );
  });

  it('should not add separator if directory name already has it', () => {
    const directoryName = '/dir/';

    expect(directoryWithBoundaries(directoryName)).toBe(directoryName);
  });

  it('should add leading separator to direcotry with only trailing one', () => {
    const directoryName = 'dir/';

    expect(directoryWithBoundaries(directoryName)).toBe(sep + directoryName);
  });

  it('should add trailing separator to directory with only leading one', () => {
    const directoryName = '/dir';

    expect(directoryWithBoundaries(directoryName)).toBe(directoryName + sep);
  });
});
