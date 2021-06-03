import { optimizeSVG } from '../src/optimize_svg';

jest.mock('fs');

describe('optimizeSVG', () => {
  const optimizedSVG = '<svg viewBox="0 0 19 40"><path d="M10 10h80"/></svg>';

  it('should read file and return its optimized version', async () => {
    const fileData = await optimizeSVG('ho.svg', [], {});

    expect(fileData).toMatch(optimizedSVG);
  });

  it('should insert classes into SVG', async () => {
    const fileData = await optimizeSVG('hot.svg', ['foo'], {});

    expect(fileData).toMatch(/class="foo"/);
  });
});
