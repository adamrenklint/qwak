let spacer = true;
let move = true;

export default function parseSpacer (raw) {

  if (raw === ':' || raw === '_') {
    var instruction = { raw, spacer, move };
    instruction.blocking = raw === ':';
    return instruction;
  }
}
