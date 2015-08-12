qwak
====

Definition and parser for qwak, a simple but expressive minimal ascii dialect for programming step-based web audio event sequences

[![Join the chat at https://gitter.im/adamrenklint/qwak](https://img.shields.io/badge/GITTER-join_chat-blue.svg?style=flat-square)](https://gitter.im/adamrenklint/qwak)
 [![npm version](https://img.shields.io/npm/v/qwak.svg?style=flat-square)](https://www.npmjs.com/package/qwak) 
 [![GitHub stars](https://img.shields.io/github/stars/adamrenklint/qwak.svg?style=flat-square)](https://github.com/adamrenklint/qwak/stargazers)
 [![Code Climate score](https://img.shields.io/codeclimate/github/adamrenklint/qwak.svg?style=flat-square)](https://codeclimate.com/github/adamrenklint/qwak)
 [![Code Climate coverage](https://img.shields.io/codeclimate/coverage/github/adamrenklint/qwak.svg?style=flat-square)](https://codeclimate.com/github/adamrenklint/qwak)


## Concepts

- A *session* consists of several *sequences*
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

## transient modifiers
+       pitch up next note (1/12th)
-       pitch down next note
%       lower volume 25% for next note
^       raise volume 25% for next note
{       pan next note to 25% left
}       pan next note to 25% right
<       pull next note cursor 1/12th step (4 of 48) back
>       push next note cursor forward
```

## Usage

### qwak.parse(raw:string) -> tree

Parses a raw qwak string into a qwak tree, an object with the attributes *tempo:number*, *bars:number* and *sequences:array*. Each sequence contains *kit:number*, *bars:number* and *notes:array*. A note contains *key:string*, *oneshot:boolean*, *pitch:number*, *volume:number*, *pan:number* and *offset:number*.

## Examples

```
/qwak           The most basic qwak sequence
/q+wa-k         Pitch "w" note up, and "k" down
/90/2=foxobaxa  Use kit 2 at 90 bpm
```

For more examples, have a look at the [extensive test suite](https://github.com/adamrenklint/qwak/blob/master/test/qwak.test.md)

## License

[MIT](https://github.com/adamrenklint/qwak/blob/master/LICENSE.md) © 2015 [Adam Renklint](http://adamrenklint.com)

---
*Generated with [redok](https://github.com/adamrenklint/redok) @ Wednesday August 12th, 2015 - 9:01:27 PM*