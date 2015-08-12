export default function getSequenceLength (notes) {

  if (!notes.length) return 0;

  let lastNote = notes[notes.length - 1];
  let duration = lastNote.duration ? lastNote.duration / 48 : lastNote.size;
  let endStep = lastNote.step + duration;
  let bars = (endStep - 1) / 8;
  return bars;
}
