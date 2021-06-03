import { buildImageName } from '../src/image_name';

describe('buildImageName', () => {
  it('should use pathname if image is located in Web', () => {
    const input = 'https://site.com/image';
    const sourcePath = 'anything-i-could-guess';
    const extension = 'png';

    expect(buildImageName(input, sourcePath, extension)).toBe('image.png');
  });

  it('should use pathname and ignore search parameters if image is located in Web', () => {
    const input = 'https://site.com/image?query=5&other=stuff';
    const sourcePath = 'anything-i-could-guess';
    const extension = 'png';

    expect(buildImageName(input, sourcePath, extension)).toBe('image.png');
  });

  it('should use path to image in file system if first argument is not an URL', () => {
    const input = 'path/to/image.svg';
    const sourcePath = '/right/path/to/image.svg';
    const extension = 'svg';

    expect(buildImageName(input, sourcePath, extension)).toBe('image.svg');
  });

  it('should use extension parameter to append extension to file name', () => {
    const input = 'path/to/image.svg';
    const sourcePath = '/right/path/to/image.svg';
    const extension = 'jpeg';

    expect(buildImageName(input, sourcePath, extension)).toBe('image.jpeg');
  });
});
