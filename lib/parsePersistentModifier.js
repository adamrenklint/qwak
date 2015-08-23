let persistent = true;

let handlers = {
  ',' (cursor) { cursor.triplets(true); },
  '.' (cursor) { cursor.triplets(false); },
  '(' (cursor) { cursor.speed(cursor.speed() / 2); },
  ')' (cursor) { cursor.speed(cursor.speed() * 2); },
  '&' (cursor, notes) {
    let lastNote = notes[notes.length - 1];
    if (lastNote) {
      let lastStep = lastNote.step - lastNote.offset;
      cursor.position(lastStep);
      cursor.offset(lastNote.offset);
    }

  },
  '*' (cursor, notes) {
    let lastNote = notes[notes.length - 1];
    if (lastNote) {
      lastNote.jumpTo = 1;
    }
  },
  ';' (cursor, notes) {
    let lastNote = notes[notes.length - 1];
    if (lastNote) {
      lastNote.jumpTo = 1;
      lastNote.jumpRounded = true;
    }
  }
};

export default function parsePersistentModifier (raw) {

  let handler = handlers[raw];

  if (handler) {
    return { raw, persistent, handler };
  }
}
