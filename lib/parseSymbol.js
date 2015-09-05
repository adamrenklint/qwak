import parseNote from './parseNote';
import parseSpacer from './parseSpacer';
import parseRepeater from './parseRepeater';
import parseGrouper from './parseGrouper';
import parseTransientModifier from './parseTransientModifier';
import parsePersistentModifier from './parsePersistentModifier';
import parseEffect from './parseEffect';

export default function parseSymbol (raw, index, list) {

  return parseNote(raw) || parseSpacer(raw) || parseRepeater(raw) || parseGrouper(raw) || parseTransientModifier(raw, index, list) || parsePersistentModifier(raw) || parseEffect(raw, index, list);
}
