export default function calculateLastNotesDuration (end, notes) {

  end = 1 + (end * 8);

  let lastNote = notes[notes.length - 1];
  if (lastNote) {
    notes.forEach((note, index) => {
      if (note.step === lastNote.step) {
        if (note && note.note && !note.oneshot) {
          let diff = end - note.step;
          note.duration = note.duration || Math.round(diff * 48);
        }
      }
    });
  }
}
