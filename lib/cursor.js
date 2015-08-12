let currentPosition, currentSpeed, tripletMeasure;

function reset () {
  currentPosition = 1;
  currentSpeed = 1;
  tripletMeasure = false;
}

function size () {

  let increment = 1 * currentSpeed;
  if (tripletMeasure) {
    increment = (increment / 3) * 2;
  }
  return increment;
}

function step () {

  currentPosition += size();
}

function position (position) {
  if (position) {
    currentPosition = position;
  }
  else {
    return currentPosition;
  }
}

function speed (speed) {
  if (speed) {
    currentSpeed = speed;
  }
  else {
    return currentSpeed;
  }
}

function triplets (triplets) {
  if (typeof triplets === 'boolean') {
    tripletMeasure = triplets;
  }
  else {
    return tripletMeasure;
  }
}

export default { reset, step, position, speed, triplets, size };
