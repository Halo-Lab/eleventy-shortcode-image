interface Attributes {
  readonly [name: string]: string;
}

/** Creates \<img> string element. */
export const createImg = (attributes: Attributes): string =>
  `<img ${Object.entries(attributes).reduce(
    (all, [name, value]) => all + ' ' + name + '="' + value + '"',
    ''
  )} />`;
