export default function findLongestSequence (sequences) {

  var longestSequence = 0;
  sequences.forEach(sequence => {
    if (sequence.bars > longestSequence) {
      longestSequence = sequence.bars;
    }
  });
  return longestSequence;
}
