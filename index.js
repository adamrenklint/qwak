import createTree from './lib/createTree';
import createSequence from './lib/createSequence';
import parseSymbol from './lib/parseSymbol';
import execute from './lib/execute';
import appendPosition from './lib/appendPosition';
import calculateDuration from './lib/calculateDuration';
import calculateLastNoteDuration from './lib/calculateLastNoteDuration';
import filterSpacer from './lib/filterSpacer';
import getSequenceLength from './lib/getSequenceLength';
import findLongestSequence from './lib/findLongestSequence';
import handleHalfBarSequence from './lib/handleHalfBarSequence';
import executeJumpCommands from './lib/executeJumpCommands';

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

  if (longestSequence <= 0.5) {
    tree.sequences = tree.sequences.map(handleHalfBarSequence);
  }

  tree.sequences.forEach(sequence => {
    if (!sequence.notes.length) return;

    executeJumpCommands(tree.bars, sequence);

    sequence.notes = sequence.notes
      .map(calculateDuration)
      .filter(filterSpacer)
      .map(appendPosition);

    let lastIndex = sequence.notes.length - 1;
    let lastNote = sequence.notes[lastIndex];
    sequence.notes[lastIndex] = calculateLastNoteDuration(tree.bars, lastNote);
  });

  return tree;
}
