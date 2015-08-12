let transient = true;

let handlers = {
  '-' (note) { note.pitch -= 12; },
  '+' (note) { note.pitch += 12; },
  '%' (note) { note.volume -= 25; },
  '^' (note) { note.volume += 25; },
  '{' (note) { note.pan -= 25; },
  '}' (note) { note.pan += 25; },
  '<' (note, cursor) { note.offset -= cursor.speed() / 12; },
  '>' (note, cursor) { note.offset += cursor.speed() / 12; }
};

export default function parseTransientModifier (raw) {

  let handler = handlers[raw];

  if (handler) {
    return { raw, transient, handler };
  }
}
