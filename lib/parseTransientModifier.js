import findNumericValue from './findNumericValue';

const characters = "~§∞≈-+%^{}<>'`";
const transient = true;

function modifierFactory (symbol, value) {
  return (note, cursor) => {
    switch (symbol) {

      case '~': return note.shift += (value || 100) / 1000;
      case '§': return note.maxlength = value ? value / 1000 : 0;
      case '∞': return note.loop = (value || 100) / 1000;
      case '≈': return note.reverse = !note.reverse;
      case '-': return note.pitch -= (value || 12);
      case '+': return note.pitch += (value || 12);
      case '%': return note.volume = note.volume -= (value || 20);
      case '^': return note.volume = note.volume += (value || 20);
      case '{': return note.pan -= (value || 25);
      case '}': return note.pan += (value || 25);
      case '<': return note.offset -= value ? value / 48 : cursor.speed() / 12;
      case '>': return note.offset += value ? value / 48 : cursor.speed() / 12;
      case "'": return note.attack += (value || 100) / 1000;
      case "`": return note.release += (value || 100) / 1000;
    }
  }
}

export default function parseTransientModifier (raw, index, list) {

  if (~characters.indexOf(raw)) {
    const numericValue = findNumericValue(index + 1, list);
    const handler = modifierFactory(raw, numericValue)
    return { raw, transient, handler };
  }
}
