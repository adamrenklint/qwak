import parseNote from './parseNote';
import parseSpacer from './parseSpacer';
import parseRepeater from './parseRepeater';
import parseGrouper from './parseGrouper';
import parseTransientModifier from './parseTransientModifier';
import parsePersistentModifier from './parsePersistentModifier';

export default function parseSymbol (raw) {

  return parseNote(raw) || parseSpacer(raw) || parseRepeater(raw) || parseGrouper(raw) || parseTransientModifier(raw) || parsePersistentModifier(raw);
}
