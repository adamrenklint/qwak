import createContext from './createContext';
import createSequence from './createSequence';
import parseSymbol from './parseSymbol';
import execute from './execute';
import appendPosition from './appendPosition';
import calculateDuration from './calculateDuration';
import calculateLastNotesDuration from './calculateLastNotesDuration';
import filterSpacer from './filterSpacer';
import getSequenceLength from './getSequenceLength';
import findLongestSequence from './findLongestSequence';
import handleHalfBarSequence from './handleHalfBarSequence';
import executeJumpCommands from './executeJumpCommands';
import filterDuration from './filterDuration';

export function parse (raw) {
  let context = createContext(raw);
  context.sequences = context.sections.map(section => {

    let sequence = createSequence(section);
    let instructions = sequence.characters.map(parseSymbol);

    sequence.notes = execute(instructions);
    sequence.bars = getSequenceLength(sequence.notes);

    return sequence;
  });

  let longestSequence = findLongestSequence(context.sequences);
  context.bars = Math.ceil(longestSequence);

  context.sequences.forEach(sequence => {
    if (!sequence.notes.length) return;
    sequence.didJump = executeJumpCommands(context.bars, sequence);
  });

  if (longestSequence <= 0.5) {
    context.sequences = context.sequences.map(sequence => {
      if (sequence.didJump) return sequence;
      calculateLastNotesDuration(0.5, sequence.notes);
      return handleHalfBarSequence(sequence);
    });
  }

  context.sequences.forEach(sequence => {
    if (!sequence.notes.length) return;

    sequence.notes = sequence.notes
      .map(calculateDuration)
      .filter(filterSpacer)
      .map(appendPosition);

    calculateLastNotesDuration(context.bars, sequence.notes);

    sequence.notes = sequence.notes.filter(note => {
      return !!note.note && (note.duration || note.oneshot || note.maxlength);
    }).map(filterDuration);
  });

  return context;
}
