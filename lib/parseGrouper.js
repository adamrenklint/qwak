export default function parseNote (raw) {

  if (raw === '[') {
    return { startGroup: true };
  }
  else if (raw === ']') {
    return { endGroup: true };
  }
}
