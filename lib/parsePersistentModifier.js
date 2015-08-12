let persistent = true;

let handlers = {
  ',' (cursor) { cursor.triplets(true); },
  '.' (cursor) { cursor.triplets(false); },
  '(' (cursor) { cursor.speed(cursor.speed() / 2); },
  ')' (cursor) { cursor.speed(cursor.speed() * 2); },
  '&' (cursor, notes) {
    let lastNote = notes[notes.length - 1];
    let lastStep = lastNote && lastNote.step || 1;
    cursor.position(lastStep);
  },
  '*' (cursor, notes) {
    let lastNote = notes[notes.length - 1];
    if (lastNote) {
      lastNote.jumpTo = 1;
    }
  }
};

export default function parsePersistentModifier (raw) {

  let handler = handlers[raw];

  if (handler) {
    return { raw, persistent, handler };
  }
}
