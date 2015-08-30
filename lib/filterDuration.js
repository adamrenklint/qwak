export default function filterDuration (note) {
  if (note.maxlength) note.duration = 0;
  return note;
}
