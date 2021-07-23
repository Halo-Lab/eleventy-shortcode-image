# [1.4.0] - 2021-07-23

### Added

- Add `toHTML` into `ImageProperties` for granular controlling output HTML for SVG.

### Changed

- Rename `ImageAttributes` to `ImageProperties`.

## [1.3.0] - 2021-07-22

### Added

- Memoizing repeated images (in-memory).
- Automatic image downloading.
- Ability to generate HTML for GIF.
- Ability to insert SVG into HTML or add it as link in \<img> element.

### Changed

- Handle up to 40 images in parallel.
- By default, for most raster formats plugin generates `jpeg`, `webp` and `avif` images.

## [1.2.0] - 2021-06-03

### Added

- Debug logger in `EleventyShortcodeImage` namespace.
- Images that are downloaded from the Web will have names from `URL.pathname` property.

### Removed

- _output_ directory is not source of truth for SVGs anymore.

### Fixed

- Ability to process remote images.

## [1.1.1] - 2021-05-05

### Changed

- Shortcode writes images with the same relative paths as in source directory (save subdirectories).
- Shortcode does not rename files now.

## [1.1.0] - 2021-04-29

### Added

- `svgoOptions` option for configuration of behavior of [svgo](https://github.com/svg/svgo) package.
- `rasterOptions` option for [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) package behavior optimization.

## [1.0.1] - 2021-04-01

### Fixed

- Provide default value for `alt` and `title` attributes if user did not pass them.

## [1.0.0] - 2021-04-01

### Added

- Image transformation and compression.
- SVG optimization.
- Adding or changing classes in SVG.
