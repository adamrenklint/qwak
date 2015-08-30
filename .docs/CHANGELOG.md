# Changelog

{{#changelog version="0.4.1" date="2015-08-30" from="v0.4.0" to="v0.4.1"}}
- Fixed value format for maxlength instruction, now uses seconds
{{/changelog}}

{{#changelog version="0.4.0" date="2015-08-30" from="v0.3.5" to="v0.4.0"}}
- Added ```∞``` sample loop symbol
- Added ```§``` sample maxlength symbol
{{/changelog}}

{{#changelog version="0.3.5" date="2015-08-27" from="v0.3.4" to="v0.3.5"}}
- Fixed issue with trailing zero-duration notes being added because of a rounding error
{{/changelog}}

{{#changelog version="0.3.4" date="2015-08-26" from="v0.3.3" to="v0.3.4"}}
- Fixed issue with wrong duration being calculated for layered notes
- Fixed issue with wrong duration being calculated for trailing spacer note followed a jump command
{{/changelog}}

{{#changelog version="0.3.3" date="2015-08-23" from="v0.3.2" to="v0.3.3"}}
- Fixed issue with step layer symbol leaking offset to following notes
{{/changelog}}

{{#changelog version="0.3.2" date="2015-08-23" from="v0.3.1" to="v0.3.2"}}
- Fixed issue with jump commands giving the wrong duration to duplicated notes
{{/changelog}}

{{#changelog version="0.3.1" date="2015-08-22" from="v0.3.0" to="v0.3.1"}}
- Fixed issue with jump commands being executed after duplicating half bar sequence
{{/changelog}}

{{#changelog version="0.3.0" date="2015-08-22" from="v0.2.1" to="v0.3.0"}}
- Added reverse transient modifier: ```≈```
{{/changelog}}

{{#changelog version="0.2.1" date="2015-08-22" from="v0.2.0" to="v0.2.1"}}
- Fixed issue with bar jump modifier not looping properly for exact half bars
{{/changelog}}

{{#changelog version="0.2" date="2015-08-22" from="v0.1.0" to="v0.2.0"}}
- Added sample shift modifier: ```~```
- Added bar jump modifier: ```;```
- Added attack and release transient fade modifiers: ```' and ` ```
- Added granular control of transient modifiers with numeric value
- Fixed many small bugs with parsing and interpretation
{{/changelog}}

{{#changelog version="0.1" date="2015-08-12" from="248783be0f026881d43f6af25128f1512047b8a3" to="v0.1.0"}}
- Initial public release
{{/changelog}}
