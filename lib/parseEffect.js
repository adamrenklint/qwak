import findParams from './findParams';

const characters = "∆";
const effect = true;

function effectFactory (symbol, params) {
  return note => {
    switch (symbol) {

      case '∆': return Object.assign(note, {
        bitcrush: params[0] || 12,
        bitcrushFreq: params[1] || 0,
        bitcrushMix: params[2] || 0
      });
    }
  }
}

export default function parseTransientModifier (raw, index, list) {

  if (~characters.indexOf(raw)) {
    const params = findParams(index + 1, list);
    const handler = effectFactory(raw, params)
    return { raw, effect, handler };
  }
}
