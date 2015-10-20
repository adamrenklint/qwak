# Changelog

## v0.5.0 (2015-09-05) [diff](https://github.com/adamrenklint/qwak/compare/v0.4.1...v0.5.0)

- Added ```∆``` bitcrush effect symbol

## v0.4.1 (2015-08-30) [diff](https://github.com/adamrenklint/qwak/compare/v0.4.0...v0.4.1)

- Fixed value format for maxlength instruction, now uses seconds

## v0.4.0 (2015-08-30) [diff](https://github.com/adamrenklint/qwak/compare/v0.3.5...v0.4.0)

- Added ```∞``` sample loop symbol
- Added ```§``` sample maxlength symbol

## v0.3.5 (2015-08-27) [diff](https://github.com/adamrenklint/qwak/compare/v0.3.4...v0.3.5)

- Fixed issue with trailing zero-duration notes being added because of a rounding error

## v0.3.4 (2015-08-26) [diff](https://github.com/adamrenklint/qwak/compare/v0.3.3...v0.3.4)

- Fixed issue with wrong duration being calculated for layered notes
- Fixed issue with wrong duration being calculated for trailing spacer note followed a jump command

## v0.3.3 (2015-08-23) [diff](https://github.com/adamrenklint/qwak/compare/v0.3.2...v0.3.3)

- Fixed issue with step layer symbol leaking offset to following notes

## v0.3.2 (2015-08-23) [diff](https://github.com/adamrenklint/qwak/compare/v0.3.1...v0.3.2)

- Fixed issue with jump commands giving the wrong duration to duplicated notes

## v0.3.1 (2015-08-22) [diff](https://github.com/adamrenklint/qwak/compare/v0.3.0...v0.3.1)

- Fixed issue with jump commands being executed after duplicating half bar sequence

## v0.3.0 (2015-08-22) [diff](https://github.com/adamrenklint/qwak/compare/v0.2.1...v0.3.0)

- Added reverse transient modifier: ```≈```

## v0.2.1 (2015-08-22) [diff](https://github.com/adamrenklint/qwak/compare/v0.2.0...v0.2.1)

- Fixed issue with bar jump modifier not looping properly for exact half bars

## v0.2 (2015-08-22) [diff](https://github.com/adamrenklint/qwak/compare/v0.1.0...v0.2.0)

- Added sample shift modifier: ```~```
- Added bar jump modifier: ```;```
- Added attack and release transient fade modifiers: ```' and ` ```
- Added granular control of transient modifiers with numeric value
- Fixed many small bugs with parsing and interpretation

## v0.1 (2015-08-12) [diff](https://github.com/adamrenklint/qwak/compare/248783be0f026881d43f6af25128f1512047b8a3...v0.1.0)

- Initial public release

---
*Generated with [redok](https://github.com/adamrenklint/redok) @ Wednesday October 14th, 2015 - 11:20:36 PM*