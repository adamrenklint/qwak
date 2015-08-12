export default function createSequence (raw) {

  let kitId = 1;
  if (~raw.indexOf('=')) {
    var parts = raw.split('=');
    var parsedKitId = parseInt(parts[0], 10);
    if (parsedKitId && !isNaN(parsedKitId)) {
      kitId = parsedKitId;
    }
    raw = parts[1];
  }
  if (~raw.indexOf('=')) {
    throw new Error('only one kit definition allowed per sequence');
  }

  if (~raw.indexOf('*')) {
    raw = raw.split('*')[0] + '*';
  }

  let sequence = {
    kit: kitId,
    raw: raw,
    characters: raw.split(''),
    bars: 0,
    notes: []
  };

  return sequence;
}
