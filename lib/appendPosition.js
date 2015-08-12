export default function appendPosition (note) {

  // let { step, offset } = note;
  // step += offset;
  let { step } = note;

  let beats = (step - 1) / 2;
  let roundedBeats = Math.floor(beats);
  let restBeats = beats - roundedBeats;
  let ticks = Math.round(96 * restBeats);
  if (ticks > 95) {
    roundedBeats++;
    ticks = ticks - 96;
  }

  let displayBar = 1;
  let displayBeats = roundedBeats + 1;
  let displayTicks = ticks + 1;
  if (displayTicks < 10) {
    displayTicks = '0' + displayTicks;
  }

  note.position = [displayBar, displayBeats, displayTicks].join('.');
  return note;
}
