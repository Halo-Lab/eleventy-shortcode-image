# [1.1.1] - 2021-05-05

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
