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

- A *session* consists of several layered *sequences*
- A *sequence* maps to a *kit* by id
- Steps are 48 ticks, 2/16 beats, by default

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
*       jump to start and repeat sequence

## persistent modifiers
(       increase step resolution
)       decrease step resolution
[       start block, nestable, applies transient modifiers to block
]       end block
,       start triplet resolution (48 > 32)
.       stop triplet resolution (32 > 48)

## simple transient modifiers
+       pitch up next note (1/12th)
-       pitch down next note
%       lower volume 25% for next note
^       raise volume 25% for next note
{       pan next note to 25% left
}       pan next note to 25% right
<       pull next note cursor 1/12th step (4 of 48) back
>       push next note cursor forward
~       shift sample starting point 0.1 seconds

## granular transient modifiers
+52     pitch up next note (52/100th)
-18     pitch down next note (18/100th)
%33     lower volume 33% for next note
^10     raise volume 10% for next note
{40     pan next note to 40% left
}60     pan next note to 60% right
<10     pull next note cursor 10 ticks back
>8      push next note cursor 8 ticks forward
~350    shift sample starting point 0.35 seconds
```

## Install

```
$ npm install --save qwak
```

## Usage

```
var qwak = require('qwak');
var context = qwak.parse('/qwak');
```

### qwak.parse(raw:string) -> context

Parses a raw qwak string into a qwak context, an object with the attributes *tempo:number*, *bars:number* and *sequences:array*. Each sequence contains *kit:number*, *bars:number* and *notes:array*. A note contains *key:string*, *oneshot:boolean*, *pitch:number*, *volume:number*, *pan:number* and *offset:number*.

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
*Generated with [redok](https://github.com/adamrenklint/redok) @ Friday August 21st, 2015 - 11:13:04 PM*