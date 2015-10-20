{{package.name}}
====



    IMPROVE DOCS with v0.6

    - break #Syntax up into logical pieces, with examples of input and output (generate with a redok helper/partial, or just a script to generate checked in markdown files)



{{package.description}}

{{>badges/gitter}} {{>badges/npm-version}} {{>badges/github-stars}} {{>badges/travis}} {{>badges/npm-dependencies}} {{>badges/codeclimate-score}} {{>badges/codeclimate-coverage}}

Made by [Adam Renklint](http://adamrenklint.com), Berlin august-october 2015. Inspired by [Typedrummer](http://typedrummer.com/) by [Kyle Stetz](http://kylestetz.com/).

## Concepts

- Timing is based on steps, by default 1/8th bar long
- Two types of characters: hard symbols move step cursor, soft symbols do not
- Raw string is parsed into a *Pattern*, with of several layered *sequences*
- *Sequence* maps to a *kit* by id and contains an array of *notes*
- *Note* contains full instructions for how to schedule and play a sample

## Install

```
$ npm install --save qwak
```

## Usage

```
var qwak = require('qwak');
var pattern = qwak.parse('/90/1=qwak/3=PC:T??G&C_');
```

### qwak.parse(raw:string) -> pattern

## Models

### pattern

| **name** | **type** | **description**|
|----------|----------|----------------|
| tempo | number | tempo in BPM |
| bar | number | length of pattern |
| sequences | array | |

### sequence

| **name** | **type** | **description**|
|----------|----------|----------------|
| kit | number | reference to source of samples |
| bars | number | length of sequence |
| notes | array | |

### notes

| **name** | **type** | **description**|
|----------|----------|----------------|
| key | string | one-char reference to slot on kit |
| step | number | position of note |
| duration | number | note length in *step / 48 ticks*
| position | string | step position reformatted "bar.beat.tick" |
| shift | number | sample start offset in seconds |
| maxlength | number | max sample playback length in seconds |
| loop | number | seconds, loop part of sample |
| reverse | boolean | reverse sample chunk playback |
| oneshoot | boolean | |
| pitch | number (-999 - 999) | amount of pitch shift in *12th of octave* |
| volume | number (-999 - 999) | |
| pan | number (-100 - 100) | |
| bitcrush | number (1 - 16) |
| bitcrushMix | number (20 - 22050) |
| effects | array | |
| attack | number | seconds to fade in sample playback |
| release | number | seconds to fade out sample playback |

## Syntax

### Delimiter

```/``` starts a qwak string, and separates pattern options and each sequence

```
> "/85/1=qwak/2=iion"
< { tempo: 85, bars: 1, sequences: [ first, second] }
```

### Tempo

Tempo is defined by a number after the first ```/```.

```
> "/78/1=qwak"
< { tempo: 78, bars: 1, ... }
```

If omitted, tempo defaults to 90.

```
> "/1=qwak"
< { tempo: 90, bars: 1, ... }
```

### Sample triggers

Lowercased symbols define oneshot notes.

```
> "/1=qwak"
< { tempo: 90, bars: 1, ... }
```

Uppercased symbols define notes that play until the next blocking note

Skip or block steps to keep playing a note, or stopping it.

Lowercased symbols also work as blockers for uppercased symbols.

### Repeat triggers

Repeat the previous note on current step.

Repeat the previous note, with volume decreased 25%.

### Step triggers

Jump to the start of next step and repeat sequence.

Jump to the start of next bar and repeat sequence.

## Modify step cursor

(       increase step resolution
)       decrease step resolution
,       enable triplet resolution (4/4 > 3/4)
.       disable triplet resolution (3/4 > 4/4)

### Block symbols

[       start block, nestable, applies modifiers to block
]       end block

## Trigger modifiers


---

```

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

## Examples

```
/qwak           The most basic qwak sequence
/q+wa-k         Pitch "w" note up, and "k" down
/90/2=foxobaxa  Use kit 2 at 90 bpm
```

For more examples, have a look at the [extensive test suite]({{github.url}}/blob/master/test/qwak.test.js)

## License

[MIT]({{github.url}}/blob/master/LICENSE.md) © 2015 [Adam Renklint](http://adamrenklint.com)
