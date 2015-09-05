let oneshotChars = 'qwertyuiopasdfghjklzxcvbnm';
let noteOnChars = 'QWERTYUIOPASDFGHJKLZXCVBNM';

export default function parseNote (raw) {

  let isOneShot = !!~oneshotChars.indexOf(raw);
  let isNoteOn = !!~noteOnChars.indexOf(raw);

  if (!isOneShot && !isNoteOn) return;

  let note = {
    note: true,
    move: true,
    key: raw,
    oneshot: isOneShot,
    maxlength: 0,
    duration: 0,
    loop: 0,
    pitch: 0,
    volume: 100,
    pan: 0,
    offset: 0,
    shift: 0,
    attack: 0,
    release: 0,
    reverse: false,
    bitcrush: 0,
    bitcrushFreq: 0,
    bitcrushMix: 0
  };

  return note;
}
