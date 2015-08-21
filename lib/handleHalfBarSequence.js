import appendPosition from './appendPosition';

export default function handleHalfBarSequence (sequence) {

  if (sequence.bars <= 0.5) {

    sequence.notes.forEach(note => {

      let newNote = {};
      for (let key in note) {
        newNote[key] = note[key];
      }

      newNote.step += 4;
      newNote = appendPosition(newNote);

      sequence.notes.push(newNote);
    });

    sequence.bars = 1;
  }

  return sequence;
}
