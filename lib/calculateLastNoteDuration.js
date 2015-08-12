export default function calculateLastNoteDuration (end, note) {

  end = 1 + (end * 8);

  if (note.note && !note.oneshot) {
    let diff = end - note.step;
    note.duration = note.duration || Math.round(diff * 48);
  }

  return note;
}
