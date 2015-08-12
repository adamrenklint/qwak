let numberRE = /^\d+$/;

export default function createTree (raw) {

  let tree = {
    tempo: 88,
    bars: 0,
    sequences: [],
    sections: raw.split('/'),
    raw: raw
  };

  // if the command was formatted with a leading slash,
  // the first section is empty and should be ignored
  if (!tree.sections[0]) {
    tree.sections.shift();
  }

  // attempt to parse tempo
  let firstSection = tree.sections[0];
  if (numberRE.test(firstSection)) {
    tree.tempo = parseInt(firstSection, 10);
    tree.sections.shift();
  }

  for (let key in tree.sections) {
    if (numberRE.test(tree.sections[key])) {
      throw new Error('tempo command only allowed in leading position');
    }
  }

  return tree;
}
