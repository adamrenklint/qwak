import findParams from './findParams';

const characters = "∆®¿Ω";
const effect = true;

const filterKeys = ['filter'];
const filterTypes = ['highpass', 'lowpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'];
const booleanKeys = ['reverse', 'bypass', 'sync'];

function mapParams(params, ...names) {
  let mapped = {};
  params.forEach((param, index) => {
    const name = names[index];
    if ((param || param === 0) && name) {
      param = ~filterKeys.indexOf(name) ? filterTypes[param - 1] : param;
      param = ~booleanKeys.indexOf(name) ? !!param : param;
      mapped[name] = param;
    }
  })
  return mapped;
}

function effectFactory (symbol, params) {
  return note => {
    switch (symbol) {

      case '∆': return Object.assign(note, {
        bitcrush: params[0] || 12,
        bitcrushFreq: params[1] || 0,
        bitcrushMix: params[2] || 0
      });
      case '®': return note.effects.push({
        type: 'reverb',
        ...mapParams(params, 'wet', 'dry', 'time', 'decay', 'filter', 'cutoff', 'reverse', 'bypass')
      });
      case '¿': return note.effects.push({
        type: 'delay',
        ...mapParams(params, 'wet', 'dry', 'sync', 'time', 'feedback', 'filter', 'cutoff', 'bypass')
      });
      case 'Ω': return note.effects.push({
        type: 'compressor',
        ...mapParams(params, 'threshold', 'knee', 'ratio', 'attack', 'release', 'gain', 'bypass')
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
