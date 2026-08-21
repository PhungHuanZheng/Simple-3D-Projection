class Point {
    constructor(x, y, z) {
        this.initPos = new Matrix([[x], [y], [z], [1]]);
        this.truePos = new Matrix([[x], [y], [z], [1]]);
        this.projPos;
    }

    // 2D array passed into pipeline()
    pipeline(...args) {
        // set back to initial pos
        this.truePos = this.initPos.copy();

        // ...args is a 2D array containing instructions: [[FUNC_NAME, VALUE], [FUNC_NAME, VALUE], ...]
        let newMatrix = args[0][0](args[0][1]);
        for (let i = 1; i < args.length; i++) {
            newMatrix = newMatrix.matmul(args[i][0](args[i][1]));
        }
        this.truePos = newMatrix.matmul(this.truePos);
        return this;
    }

    // passes the 3d coordinates of the point through a projection matrix (?)
    project() {
        // extract values from truePos
        let x = this.truePos.at(0, 0);
        let y = this.truePos.at(1, 0);
        let z = this.truePos.at(2, 0);

        this.projPos = createVector(
            (((x / (z + CAMERA_POS.z)) + PROJECTION_WIDTH / 2) * (CANVAS_WIDTH / PROJECTION_WIDTH)),
            (CANVAS_HEIGHT - ((y / (z + CAMERA_POS.z)) + PROJECTION_HEIGHT / 2) * (CANVAS_HEIGHT / PROJECTION_HEIGHT)),
            z
        );
    }

    render(r, g, b) {
        noStroke(); fill(r, g, b);
        circle(this.projPos.x, this.projPos.y, 4);
    }
}