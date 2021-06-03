import { isUrl } from '../src/is_url';

describe('isUrl', () => {
  it('should return true if text is url without TLS', () => {
    const text = 'http://localhost:5000';

    expect(isUrl(text)).toBe(true);
  });

  it('should return true if text is url with TLS', () => {
    const text = 'https://google.com';

    expect(isUrl(text)).toBe(true);
  });

  it('should return false if text is relative path', () => {
    const text = '../../directory/index.html';

    expect(isUrl(text)).toBe(false);
  });

  it('should return false if text is absolute path', () => {
    const text = process.cwd();

    expect(isUrl(text)).toBe(false);
  });
});
