// Face must be part of an object to be rendered, only functions as a storage class
// for its 3 points and its angle from its origin
class Face {
    constructor(pt1, pt2, pt3) {
        this.points = [pt1, pt2, pt3];

        this.origin = null;
        this.min_x = null;
        this.max_x = null;
        this.min_y = null;
        this.max_y = null;
        this.min_z = null;
        this.max_z = null;

        this.colour = color(random(255), random(255), random(255))
    }

    // determines if facing away from camera for backface culling
    isBackFace() {
        let pt1 = this.points[0];
        let pt2 = this.points[1];
        let pt3 = this.points[2];

        // build matrix with X Y and W components
        let matrix = new Matrix([
            [pt1.truePos.at(0, 0), pt2.truePos.at(0, 0), pt3.truePos.at(0, 0)],
            [pt1.truePos.at(1, 0), pt2.truePos.at(1, 0), pt3.truePos.at(1, 0)],
            [pt1.truePos.at(3, 0), pt2.truePos.at(3, 0), pt3.truePos.at(3, 0)],
        ])
        return matrix.det() > 0;
    }
}