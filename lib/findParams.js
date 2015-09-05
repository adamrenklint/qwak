let numberRE = /^\d+$/;

export default function findParams (startIndex, list) {

  let params = [];
  let insertIndex = 0;
  let value = '';

  function next (index) {
    let char = list[index];
    if (char && numberRE.test(char)) {
      value += char;
      list[index] = null;
      next(index + 1);
    }
    else if (char === '|') {
      const numericValue = value && numberRE.test(value) ? parseInt(value, 10) : value;
      params[insertIndex] = numericValue;
      insertIndex++;
      list[index] = null;
      value = '';
      next(index + 1);
    }
    else {
      const numericValue = value && numberRE.test(value) ? parseInt(value, 10) : value;
      params[insertIndex] = numericValue;
    }
  }

  next(startIndex);

  return params;
}
