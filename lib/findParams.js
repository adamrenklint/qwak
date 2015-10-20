const numberRE = /^0|1|2|3|4|5|6|7|8|9$/;
const intRE = /^-?\d+$/;
const floatRE = /^-?(\d|\.)+$/;

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
    else if ((char === '.' || char === '-') && numberRE.test(list[index + 1])) {
      value += char;
      list[index] = null;
      next(index + 1);
    }
    else {
      const numericValue = value && intRE.test(value) ? parseInt(value, 10) : value && floatRE.test(value) ? parseFloat(value) : value;
      params[insertIndex] = numericValue;

      if (char === '|') {
        insertIndex++;
        list[index] = null;
        value = '';
        next(index + 1);
      }
    }
  }

  next(startIndex);

  return params;
}
