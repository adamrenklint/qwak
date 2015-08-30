import cursor from './cursor';
import applyModifiers from './applyModifiers';

export default function execute (instructions) {

  cursor.reset();

  var notes = [];
  var modifiers = [[]];

  instructions.forEach((instruction, index) => {
    if (!instruction) return;

    if (instruction.persistent) {
      instruction.handler(cursor, notes);
    }
    else if (instruction.transient) {
      modifiers[modifiers.length - 1].push(instruction.handler);
    }
    else if (instruction.startGroup) {
      modifiers.push([]);
    }
    else if (instruction.endGroup) {
      modifiers.pop();
      modifiers[modifiers.length - 1] = [];
    }
    else if (instruction.repeater) {
      let lastNote = notes[notes.length - 1];
      let copy = instruction.handler(lastNote);
      if (copy) {
        copy.index = index;
        copy.step = cursor.position() + lastNote.offset;
        copy = applyModifiers(copy, modifiers[modifiers.length - 1], cursor);
        notes.push(copy);
        modifiers[modifiers.length - 1] = [];
      }
    }
    else if (instruction.note) {
      var note = applyModifiers(instruction, modifiers, cursor);
      note.index = index;
      note.offset += cursor.offset();
      note.step = cursor.position() + note.offset;
      note.size = cursor.size() - note.offset;
      if (note.maxlength) note.oneshot = false;
      notes.push(note);
      modifiers[modifiers.length - 1] = [];
    }
    else if (instruction.spacer) {
      instruction.size = cursor.size();
      instruction.step = cursor.position();
      notes.push(instruction);
    }

    if (instruction.move) {
      cursor.step();
    }
  });

  return notes;
}
