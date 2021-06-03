const fs = jest.createMockFromModule('fs');

const svg = `<svg viewBox="0 0 19 40">
<path d="M 10 10 H 90"/>
</svg>`;

module.exports = {
  ...fs,
  promises: { readFile: jest.fn((_, __) => Promise.resolve(svg)) },
};
