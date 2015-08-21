import findNumericValue from './findNumericValue';

const characters = '~-+%^{}<>';
let transient = true;

function modifierFactory (symbol, value) {
  return function modifier (note, cursor) {
    switch (symbol) {

      case '~':
        note.shift += (value || 100) / 1000;
        break;

      case '-':
        note.pitch -= (value || 12);
        break;

      case '+':
        note.pitch += (value || 12);
        break;

      case '%':
        note.volume = Math.round(note.volume -= (value || 20));
        break;

      case '^':
        note.volume = Math.round(note.volume += (value || 20));
        break;

      case '{':
        note.pan -= (value || 25);
        break;

      case '}':
        note.pan += (value || 25);
        break;

      case '<':
        note.offset -= value ? value / 48 : cursor.speed() / 12;
        break;

      case '>':
        note.offset += value ? value / 48 : cursor.speed() / 12;
        break;
    }
  }
}

export default function parseTransientModifier (raw, index, list) {

  if (~characters.indexOf(raw)) {
    let numericValue = findNumericValue(index + 1, list);
    let handler = modifierFactory(raw, numericValue)
    return { raw, transient, handler };
  }
}
