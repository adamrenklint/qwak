let numberRE = /^\d+$/;

export default function findNumericValue (startIndex, list) {

  let numericValue = '';

  function next (index) {
    let char = list[index];
    if (char && numberRE.test(char)) {
      numericValue += char;
      list[index] = null;
      next(index + 1);
    }
  }

  next(startIndex);

  return numericValue ? parseInt(numericValue, 10) : null;
}
