let numberRE = /^\d+$/;

export default function createContext (raw) {

  let context = {
    tempo: 88,
    bars: 0,
    sequences: [],
    sections: raw.split('/'),
    raw: raw
  };

  // if the command was formatted with a leading slash,
  // the first section is empty and should be ignored
  if (!context.sections[0]) {
    context.sections.shift();
  }

  // attempt to parse tempo
  let firstSection = context.sections[0];
  if (numberRE.test(firstSection)) {
    context.tempo = parseInt(firstSection, 10);
    context.sections.shift();
  }

  for (let key in context.sections) {
    if (numberRE.test(context.sections[key])) {
      throw new Error('tempo command only allowed in leading position');
    }
  }

  return context;
}
