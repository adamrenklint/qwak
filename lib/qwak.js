import createTree from './createTree';
import createSequence from './createSequence';
import parseSymbol from './parseSymbol';
import execute from './execute';
import appendPosition from './appendPosition';
import calculateDuration from './calculateDuration';
import calculateLastNoteDuration from './calculateLastNoteDuration';
import filterSpacer from './filterSpacer';
import getSequenceLength from './getSequenceLength';
import findLongestSequence from './findLongestSequence';
import handleHalfBarSequence from './handleHalfBarSequence';
import executeJumpCommands from './executeJumpCommands';

export function parse (raw) {
  let tree = createTree(raw);
  tree.sequences = tree.sections.map(section => {

    let sequence = createSequence(section);
    let instructions = sequence.characters.map(parseSymbol);

    sequence.notes = execute(instructions);
    sequence.bars = getSequenceLength(sequence.notes);

    return sequence;
  });

  let longestSequence = findLongestSequence(tree.sequences);
  tree.bars = Math.ceil(longestSequence);

  tree.sequences.forEach(sequence => {
    if (!sequence.notes.length) return;
    sequence.didJump = executeJumpCommands(tree.bars, sequence);
  });

  if (longestSequence <= 0.5) {
    tree.sequences = tree.sequences.map(sequence => {
      if (sequence.didJump) return sequence;
      let lastIndex = sequence.notes.length - 1;
      let lastNote = sequence.notes[lastIndex];
      sequence.notes[lastIndex] = calculateLastNoteDuration(0.5, lastNote);
      return handleHalfBarSequence(sequence);
    });
  }

  tree.sequences.forEach(sequence => {
    if (!sequence.notes.length) return;

    sequence.notes = sequence.notes
      .map(calculateDuration)
      .filter(filterSpacer)
      .map(appendPosition);

    let lastIndex = sequence.notes.length - 1;
    let lastNote = sequence.notes[lastIndex];
    sequence.notes[lastIndex] = calculateLastNoteDuration(tree.bars, lastNote);

    sequence.notes = sequence.notes.filter(note => {
      return !!note.note;
    });
  });

  return tree;
}
