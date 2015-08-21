let repeater = true;
let move = true;

export default function parseRepeater (raw) {

  if (raw === '!' || raw === '?') {
    var instruction = { raw, repeater, move };

    instruction.handler = function (note, notes) {
      let newNote = {};
      for (let key in note) {
        newNote[key] = note[key];
      }

      if (raw === '?') {
        newNote.volume = Math.round(newNote.volume -= 20);
      }

      return newNote;
    };

    return instruction;
  }
}
