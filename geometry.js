
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    let roundedX = Math.round(this.x * 100) / 100;
    let roundedY = Math.round(this.y * 100) / 100;
    return `(${roundedX}, ${roundedY})`;
  }

  normalized() {
    let norm = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Vector(this.x / norm, this.y / norm);
  }

  norm() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}


class Ellipse {
  // Vector, float, float, float -> Ellipse
  constructor(center, majorAxisLength, minorAxisLength, rotationAngle) {
    this.center = center;
    this.majorAxisLength = majorAxisLength;
    this.minorAxisLength = minorAxisLength;
    this.rotationAngle = rotationAngle;  // the rotation about the ellipse's center
  }

  // Ellipse, Vector -> boolean
  // Return true if the ellipse contains the vector
  containsPoint(vector) {
    let canonicalX = (
      (vector.x - this.center.x) * Math.cos(this.rotationAngle) +
      (vector.y - this.center.y) * Math.sin(this.rotationAngle)
    );
    let canonicalY = (
      -(vector.x - this.center.x) * Math.sin(this.rotationAngle) +
      (vector.y - this.center.y) * Math.cos(this.rotationAngle)
    );

    let eqn = (
      Math.pow(canonicalX / this.majorAxisLength, 2) +
      Math.pow(canonicalY / this.minorAxisLength, 2)
    );

    return eqn <= 1;
  }
}


// [[float]] -> Ellipse
// Create an Ellipse given a positive, semidefinite matrix A as input
// The ellipse is defined by the set of vectors x satisfying x^TAx = 1.
Ellipse.fromPSD = function(matrix) {

}

module.exports = {
  Vector,
  Ellipse,
};
