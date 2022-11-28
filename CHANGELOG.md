# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 28-11-2022
### Fixed
- Preserve the `crossorigin` attribute if present to fix double downloads.

## [1.4.0] - 12-08-2022
### Changed
- Moved `preloads` from an array to an object. This should improve performance since there is
  no need for deduplication.

## [1.3.0] - 11-07-2022
### Added
- Added support for `rel=preconnect` domains. See [preconnect domains](README.md#preconnect-domains).

## [1.2.0] - 11-07-2022
### Changed
- The 'preloads' array is now deduplicated before they are applied to the `link` headers. Thanks [@Erisa](https://github.com/Erisa)!

## [1.1.0] - 06-07-2022
### Changed
- `img` elements with the `loading=lazy` attribute are no-longer added to the `preloads` array.

## [1.0.0] - 05-07-2022
### Added
- Initial release
