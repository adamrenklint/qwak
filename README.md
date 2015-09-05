qwak
====

Definition and parser for qwak, a simple and expressive minimal ascii dialect for programming step-based web audio event sequences

[![Join the chat at https://gitter.im/adamrenklint/qwak](https://img.shields.io/badge/GITTER-join_chat-blue.svg?style=flat-square)](https://gitter.im/adamrenklint/qwak)
 [![npm version](https://img.shields.io/npm/v/qwak.svg?style=flat-square)](https://www.npmjs.com/package/qwak) 
 [![GitHub stars](https://img.shields.io/github/stars/adamrenklint/qwak.svg?style=flat-square)](https://github.com/adamrenklint/qwak/stargazers)
 [![Travis CI status](https://img.shields.io/travis/adamrenklint/qwak.svg?style=flat-square)](https://travis-ci.org/adamrenklint/qwak)
 [![npm dependencies](https://img.shields.io/david/adamrenklint/qwak.svg?style=flat-square)](https://david-dm.org/adamrenklint/qwak)
 [![Code Climate score](https://img.shields.io/codeclimate/github/adamrenklint/qwak.svg?style=flat-square)](https://codeclimate.com/github/adamrenklint/qwak)
 [![Code Climate coverage](https://img.shields.io/codeclimate/coverage/github/adamrenklint/qwak.svg?style=flat-square)](https://codeclimate.com/github/adamrenklint/qwak)


Made by [Adam Renklint](http://adamrenklint.com), Berlin august 2015. Inspired by [Typedrummer](http://typedrummer.com/) by [Kyle Stetz](http://kylestetz.com/).

## Concepts

- Timing is step based, where a default step is two 1/16th beats, i.e. 48 ticks
- A *pattern* consists of several layered *sequences*
- A *sequence* maps to a *kit* by id and contains an array of *notes*
- A *note* contains instructions for how to play back a sample

## Syntax

```
/86     define bpm, 86 by default (optional)
/1-9=   define kit id for sequence

## step triggers
a-z     trigger key, oneshot
A-Z     trigger key, note on until next
_       skip step, not blocking "note on" triggers
:       mute step, blocking "note on" triggers
!       repeat last note, including transient modifiers
?       repeat last note, decrease volume 25% (i.e. manual echo)
&       layer next with previous note, i.e. jump back to previous position
*       jump to start on next step and repeat sequence
;       jump to start on next bar and repeat sequence

## persistent modifiers
(       increase step resolution
)       decrease step resolution
[       start block, nestable, applies transient modifiers to block
]       end block
,       start triplet resolution (48 > 32)
.       stop triplet resolution (32 > 48)

## transient modifiers
+       pitch up next note (1/12th of octave)
-       pitch down next note
%       lower volume 20% for next note
^       raise volume 20% for next note
{       pan next note to 25% left
}       pan next note to 25% right
<       pull next note cursor 1/12th step back
>       push next note cursor 1/12th step forward
~       shift sample starting point 0.1 seconds
'       fade in next note attack in 0.1 seconds
`       fade out next note release in 0.1 seconds
≈       reverse next note or group (alt + x)
∞       loop the first 0.1 seconds of sample (alt + 5)

## transient modifier parameters
+52     pitch up next note (52/100th of octave)
-18     pitch down next note (18/100th)
%33     lower volume 33% for next note
^10     raise volume 10% for next note
{40     pan next note to 40% left
}60     pan next note to 60% right
<10     pull next note cursor 10 ticks back
>8      push next note cursor 8 ticks forward
~350    shift sample starting point 0.35 seconds
'250    fade in next note attack in 0.25 seconds
`800    fade out next note release in 0.8 seconds
∞250    loop the first 0.25 seconds of sample
§333    set next note sample maxlength to 0.333 seconds (alt + 6)

## effect modifiers
∆         bitcrush to 12 bits (alt + j)
∆8|30|40  bitcrush to 8 bits, at frequency 30/100, mix 40%
```

## Install

```
$ npm install --save qwak
```

## Usage

```
var qwak = require('qwak');
var pattern = qwak.parse('/qwak');
```

### qwak.parse(raw:string) -> pattern

Parses a raw qwak string into a qwak pattern, an object with the attributes *tempo:number*, *bars:number* and *sequences:array*. Each sequence contains *kit:number*, *bars:number* and *notes:array*. A note contains *key:string*, *oneshot:boolean*, *pitch:number*, *volume:number*, *pan:number* and *offset:number*.

## Examples

```
/qwak           The most basic qwak sequence
/q+wa-k         Pitch "w" note up, and "k" down
/90/2=foxobaxa  Use kit 2 at 90 bpm
```

For more examples, have a look at the [extensive test suite](https://github.com/adamrenklint/qwak/blob/master/test/qwak.test.js)

## License

[MIT](https://github.com/adamrenklint/qwak/blob/master/LICENSE.md) © 2015 [Adam Renklint](http://adamrenklint.com)

---
*Generated with [redok](https://github.com/adamrenklint/redok) @ Saturday September 5th, 2015 - 7:49:03 PM*