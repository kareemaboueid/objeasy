# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2025-01-19

### Added

- **New `omitit` function**: Omits specified keys from objects with deep support
- **New `flattenit` function**: Flattens nested objects with customizable options
- Test cases for `omitit` and `flattenit` functions with 100% coverage
- Comprehensive benchmarks comparing all functions including `omitit` and `flattenit`

### Changed

- **Enhanced `pickit` function**: Improved error handling and deep path support validation
- **Enhanced `modifyit` function**: Better error messages and edge case handling
- **Enhanced `mergeit` function**: Advanced array merging strategies and improved deep merge logic
- **Enhanced `transformit` function**: Enhanced mapper validation and filtering options

## [2.0.0] - 2025-01-18

### Added

- **New `mergeit` function**: Merges multiple objects with advanced strategies
- **New `transformit` function**: Transforms objects with custom mappers and filters
- Test cases for all functions with 100% coverage
- Comprehensive benchmarks comparing all functions

### Changed

- **Updated `pickit` function**: Now supports deep paths and improved error handling
- **Updated `modifyit` function**: Added erase functionality and better validation

## [1.1.0] - 2025-01-17

### Added

- `pickit` function with basic functionality for extracting keys from objects
- `modifyit` function for modifying or erasing object properties
- Updated README with initial documentation and examples
- Simple test cases for `pickit` and `modifyit` functions
- Benchmarking setup for performance comparisons

## [1.0.0] - 2025-01-15

### Initial Release

- Package initialization with basic structure
- Lint, format, and type-check scripts
- Husky pre-commit hooks for code quality
- Basic README documentation
