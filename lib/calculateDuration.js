function findNext (index, notes) {
  let next = false;
  while (++index < notes.length && !next) {
    let note = notes[index];
    if (note.note || note.spacer && note.blocking) {
      next = note;
    }
  }
  return next;
}

export default function calculateDuration (note, index, notes) {
  if (note.note && !note.oneshot) {
    let next = findNext(index, notes);
    if (next) {
      let diff = next.step - note.step;
      note.duration = Math.round(diff * 48);
    }
  }
  return note;
}
