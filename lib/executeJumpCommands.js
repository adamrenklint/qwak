import appendPosition from './appendPosition';

export default function executeJumpCommands (end, sequence) {

  let notes = sequence.notes.slice();
  let iteration = 0;

  let lastNote = notes[notes.length - 1];
  if (!lastNote.jumpTo) return;
  
  function loop () {

    iteration++;
    let cont = true;
    for (let note of notes) {
      let newNote = {};
      for (let key in note) {
        newNote[key] = note[key];
      }
      newNote.step += iteration * (sequence.bars * 8);
      let bars = (newNote.step - 1) / 8;

      if (bars < end) {
        sequence.notes.push(appendPosition(newNote));
      }
      else {
        cont = false;
      }
    }
    if (cont) {
      loop();
    }
  }

  loop();
}
