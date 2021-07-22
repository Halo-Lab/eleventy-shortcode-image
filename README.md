# eleventy-shortcode-image 🖼

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Optimize your raster and vector images 👨‍🎨

## Intention

This world needs SVG! Optimal SVGs ☝️ And we bring it, while also do not forget about beloved raster images 🙂

## Get started

### Installation

At first do:

```sh
npm i -D eleventy-shortcode-image
```

and then you can include it into `.eleventy.js`:

```js
const { createImageShortcode } = require('eleventy-shortcode-image');

module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode(
    'image',
    createImageShortcode({
      /* Options */
    })
  );
};
```

### Options

Package exports factory-function `createImageShortcode` that returns shortcode function.

This function accepts optional options:

```ts
interface ImageShortCodeOptions {
  /**
   * Path to directory where all images live.
   *
   * Should start from the _current working directory_.
   *
   * By default it is `src/assets/images`.
   */
  inputDirectory?: string;
  /**
   * Path to directory for optimized and transformed images.
   * First part of the path is meant to be the _output_ directory.
   *
   * Should start from the _current working directory_.
   *
   * By default it is `_site/images`.
   */
  outputDirectory?: string;
  /**
   * Options for [svgo](https://github.com/svg/svgo) package.
   * for subtle configuration of SVGs optimizations.
   */
  svgoOptions?: OptimizeOptions & { toHTML?: boolean };
  /**
   * Options for [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) package.
   * Is is used for optiomizations of raster images.
   * For more info see its documentation.
   */
  rasterOptions?: Record<string, any>;
}
```

Example:

```ts
const options = {
  // Do not add leading and trailing `/`
  inputDirectory: 'src/images',
  // Do not add leading and trailing `/`
  outputDirectory: '_site/images',
  svgoOptions: {
    /* ... */
  },
  rasterOptions: {
    /* ... */
  },
};
```

### Use

> [What is shortcode and how to use it?](https://www.11ty.dev/docs/shortcodes/)

This shortcode accepts two arguments:

```ts
interface ImageAttributes {
  /** Alternative text for <img>. */
  alt?: string;
  /** Title for <img>. */
  title?: string;
  /** Class names for <img>. */
  classes?: string | ReadonlyArray<string>;
}

// This is a signature of the actual shortcode.
async function image(
  src: string,
  attributes?: ImageAttributes
): Promise<string>;
```

- `src` is the path to image from `inputDirectory` that are passed to factory-function in `.eleventy.js`.

  ```js
  // .eleventy.js
  eleventyConfig.addShortcode(
    'image',
    createImageShortcode({
      inputDirectory: 'src/images',
    })
  );

  // your_template.11ty.js
  module.exports = async function () {
    // Shortcode will assume that path to image is 'src/images/some_image.png'
    return `${await this.image('some_image.png')}`;
  };
  ```

- `attributes` is a couple of attributes that can be added to image.

  > Note that while `alt`, `title` and `classes` are applicable to raster images, for SVG is applicable only the latter.

  ```js
  module.exports = async function () {
    return `${this.image('foo.png', {
      alt: 'baz',
      classes: 'my-image',
    })}`;
  };
  ```

### Debug

Package uses [debug](https://www.npmjs.com/package/debug) package to display some errors. They can be visible in `EleventyShortcodeImage` namespace. More detail on [debug's page](https://github.com/visionmedia/debug).

### What's special

- This shortcode is configured to optimize images without its resizing. So all assets save its original _width/height_ size.
- It optimizes and includes SVG into HTML and not _just copy it do build directory_. Also shortcode allows to pass your classes to SVG 😱 Yeah, we mean it 😏

Internally shortcode uses [SVGO](https://github.com/svg/svgo) and [@11ty/eleventy-img](https://github.com/11ty/eleventy-img) packages. You can configure them through according options. See above about it ☝️ .

> Note that shortcode has default options for these packages, but if you will add additional options, then some options may be overwritten. Default options for SVG optimizer is [here](https://github.com/Halo-Lab/eleventy-shortcode-image/blob/master/src/vector_optimizer_options.ts) and for raster optimizer - [here](https://github.com/Halo-Lab/eleventy-shortcode-image/blob/master/src/raster_optimizer_options.ts).

By default, SVGs are not inserted into HTML directly, but through \<img> element. If you want to insert SVG into HTML provide `toHTML` property to `svgoOptions`.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
    <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
