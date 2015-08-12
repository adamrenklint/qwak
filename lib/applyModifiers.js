export default function applyModifiers (note, modifiers, cursor) {

  for (let modifier of modifiers) {
    if (typeof modifier === 'function') {
      modifier(note, cursor);
    }
    else if (Array.isArray(modifier)) {
      applyModifiers(note, modifier, cursor);
    }
  }

  return note;
}
