// ALL METHODS RETURN A NEW MATRIX, NOTHING CHANGES THE ORIGINAL MATRIX IN PLACE
class Matrix {
    constructor(data) {
        this.data = data;
        this.shape = [this.data.length, this.data[0].length];
    }

    // rotation about X axis
    static rotateYZ(angle) {
        return new Matrix([
            [1, 0, 0, 0],
            [0, Math.cos(angle), -Math.sin(angle), 0],
            [0, Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 0, 1]
        ]);
    }

    // rotation about Y axis
    static rotateXZ(angle) {
        return new Matrix([
            [Math.cos(angle), 0, Math.sin(angle), 0],
            [0, 1, 0, 0],
            [-Math.sin(angle), 0, Math.cos(angle), 0],
            [0, 0, 0, 1]
        ]);
    }

    // rotation about Z axis
    static rotateXY(angle) {
        return new Matrix([
            [Math.cos(angle), -Math.sin(angle), 0, 0],
            [Math.sin(angle), Math.cos(angle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    }

    static translate([xOff, yOff, zOff]) {
        return new Matrix([
            [1, 0, 0, -xOff],
            [0, 1, 0, -yOff],
            [0, 0, 1, -zOff],
            [0, 0, 0, 1]
        ]);
    }

    static scale(factor) {
        return new Matrix([
            [factor, 0, 0, 0],
            [0, factor, 0, 0],
            [0, 0, factor, 0],
            [0, 0, 0, 1]
        ]);
    }

    // element getter
    at(row, column) {
        return this.data[row][column];
    }

    // transpose of the matrix/vector
    transpose() {
        let result = new Array(this.shape[1]).fill(0).map(x => new Array(this.shape[0]).fill(0));
        for (let y = 0; y < this.shape[0]; y++) {
            for (let x = 0; x < this.shape[1]; x++) {
                result[x][y] = this.data[y][x];
            }
        }
        return new Matrix(result);
    }

    // M1 x M2
    matmul(other) {
        if (this.shape[1] !== other.shape[0])
            throw Error(`Matrix.matmul: Shape mismatch between matrices of shape(${this.shape}) and shape(${other.shape})`);

        // build new data
        let data = new Array(this.shape[0]).fill(0).map(() => new Array(other.shape[1]).fill(0));

        // iterate over new matrix data shape and set values
        for (let y = 0; y < this.shape[0]; y++) {
            for (let x = 0; x < other.shape[1]; x++) {
                for (let k = 0; k < this.shape[1]; k++) {
                    data[y][x] += this.data[y][k] * other.data[k][x];
                }
            }
        }

        return new Matrix(data);
    }

    add(other) {
        if (this.shape[0] !== other.shape[0] || this.shape[1] !== other.shape[1])
            throw Error(`Matrix.add: Shape mismatch between matrices of shape(${this.shape}) and shape(${other.shape})`);

        let result = new Array(this.shape[0]).fill(0).map(x => new Array(this.shape[1]).fill(0));
        for (let y = 0; x < this.shape[0]; y++) {
            for (let x = 0; y < this.shape[1]; x++) {
                result[y][x] = this.data[y][x] + other.data[y][x]
            }
        }
        return new Matrix(result)
    }

    sub(other) {
        if (this.shape[0] !== other.shape[0] || this.shape[1] !== other.shape[1])
            throw Error(`Matrix.sub: Shape mismatch between matrices of shape(${this.shape}) and shape(${other.shape})`);

        let result = new Array(this.shape[0]).fill(0).map(x => new Array(this.shape[1]).fill(0));
        for (let y = 0; y < this.shape[0]; y++) {
            for (let x = 0; x < this.shape[1]; x++) {
                result[y][x] = this.data[y][x] - other.data[y][x]
            }
        }
        return new Matrix(result);
    }

    // dot product (standard multiplcation)
    dot(other) {
        // check that both matrices have the same shape
        if (this.shape[0] !== other.shape[0] || this.shape[1] !== other.shape[1])
            throw Error(`Matrix.dot: Shape mismatch between matrices of shape(${this.shape}) and shape(${other.shape})`);

        let result = new Array(this.shape[0]).fill(0).map(x => new Array(this.shape[1]).fill(0));
        for (let y = 0; y < this.shape[0]; y++) {
            for (let x = 0; x < this.shape[1]; x++) {
                result[y][x] = this.data[y][x] * other.data[y][x];
            }
        }
        return new Matrix(result);
    }

    cross(other) {
        // check that this is a vector
        if (this.shape[1] !== 1)
            throw Error(`cross() only applies to vectors of shape(n, 1), received shape(${this.shape}) instead`);

        // check that both vectors have the same shape
        if (this.shape[0] !== other.shape[0])
            throw Error(`Matrix.cross: Shape mismatch between vectors of shape(${this.shape}) and shape(${other.shape})`);

        if (this.shape[0] === 3) {
            return new Matrix([
                [this.at(1, 0) * other.at(2, 0) - this.at(2, 0) * other.at(1, 0)],
                [this.at(2, 0) * other.at(0, 0) - this.at(0, 0) * other.at(2, 0)],
                [this.at(0, 0) * other.at(1, 0) - this.at(1, 0) * other.at(0, 0)],
            ])
        }

        return new Matrix([
            [this.at(1, 0) * other.at(2, 0) - this.at(2, 0) * other.at(1, 0)],
            [this.at(2, 0) * other.at(0, 0) - this.at(0, 0) * other.at(2, 0)],
            [this.at(0, 0) * other.at(1, 0) - this.at(1, 0) * other.at(0, 0)],
            [1]
        ])
    }

    // determinant of a SQUARE matrix
    det() {
        // check if matrix is square
        if (this.shape[0] !== this.shape[1])
            throw Error(`Matrix.inverse: Shape mismatch: Cannot determine inverse of a non-square matrix of shape(${this.shape})`);

        // if 2x2 matrix
        if (this.shape[0] === 2) {
            return this.at(1, 1) * this.at(0, 0) - this.at(0, 1) * this.at(1, 0);
        }

        // if 3x3 matrix
        if (this.shape[0] === 3) {
            let det_A = this.at(0, 0) * (this.at(1, 1) * this.at(2, 2) - this.at(1, 2) * this.at(2, 1));
            let det_B = this.at(0, 1) * (this.at(1, 0) * this.at(2, 2) - this.at(2, 0) * this.at(1, 2));
            let det_C = this.at(0, 2) * (this.at(1, 0) * this.at(2, 1) - this.at(1, 1) * this.at(2, 0));
            return det_A - det_B + det_C;
        }
    }

    // inverse of a SQUARE matrix
    inverse() {
        // check that matrix is square and 3x3
        if (this.shape[0] !== this.shape[1] || this.shape[0] !== 3)
            throw Error(`Matrix.inverse: Shape mismatch: Cannot determine inverse of a non-square matrix of shape(${this.shape}), expects a 3x3 matrix`);

        // check if inverse exists using determinant
        const det = this.det();
        if (det === 0)
            throw Error(`Matrix.inverse: matrix passed has no inverse (determinant = 0)`);

        // get adjutant of 3x3 matrix https://www.youtube.com/watch?v=wPieefL-5uQ
        let A =  new Matrix([[this.at(1, 1), this.at(1, 2)], [this.at(2, 1), this.at(2, 2)]]).det();
        let B = -new Matrix([[this.at(1, 0), this.at(1, 2)], [this.at(2, 0), this.at(2, 2)]]).det();
        let C =  new Matrix([[this.at(1, 0), this.at(1, 1)], [this.at(2, 0), this.at(2, 1)]]).det();
        let D = -new Matrix([[this.at(0, 1), this.at(0, 2)], [this.at(2, 1), this.at(2, 2)]]).det();
        let E =  new Matrix([[this.at(0, 0), this.at(0, 2)], [this.at(2, 0), this.at(2, 2)]]).det();
        let F = -new Matrix([[this.at(0, 0), this.at(0, 1)], [this.at(2, 0), this.at(2, 1)]]).det();
        let G =  new Matrix([[this.at(0, 1), this.at(0, 2)], [this.at(1, 1), this.at(1, 2)]]).det();
        let H = -new Matrix([[this.at(0, 0), this.at(0, 2)], [this.at(1, 0), this.at(1, 2)]]).det();
        let I =  new Matrix([[this.at(0, 0), this.at(0, 1)], [this.at(1, 0), this.at(1, 1)]]).det();
        const adj = new Matrix([[A, B, C], [D, E, F], [G, H, I]]).transpose();

        return Matrix.fromShape([3, 3], 1 / det).dot(adj);
    }

    // remove the w component from a 4 x n matrix
    to_3D() {
        let result = this.copy();

        // remove last element, adjust shape
        result.data.pop();
        result.shape[0] = 3;

        // if also not a vector
        if (result.shape[1] !== 1) {
            for (let i = 0; i < result.shape[0]; i++) {
                result.data[i].pop();
            }
            result.shape[1] = 3;
        }

        return result;
    }

    // L² norm of a vector, returns single number representing how far a vector is from the origin
    L2_norm() {
        // check that matrix shape is n x 1 (vector)
        if (this.shape[1] !== 1)
            throw Error(`L2_norm() only applies to vectors of shape(n, 1), received shape(${this.shape}) instead`);

        let sum = 0;
        for (let v of this.array()) {
            sum += v * v;
        }
        return Math.sqrt(sum);
    }

    // divides a vector by its L² norm (magnitude)
    normalize() {
        // if normalizing a vector (n, 1)
        if (this.shape[1] === 1) {
            let result = [];
            for (let value of this.array()) {
                result.push([value / this.L2_norm()]);
            }
            return new Matrix(result);
        }

        // else if normalizing a matrix, separate each column into its own vector and normalize
        let vectors = this.vectors();

        for (let i = 0; i < vectors.length; i++) {
            vectors[i] = vectors[i].normalize().array();

            // let temp = 0.5 * (3 - vectors[i].transpose().matmul(vectors[i]).array()[0]);
            // vectors[i] = Matrix.fromShape([4, 1], temp).dot(vectors[i]);
        }

        return new Matrix(vectors).transpose();
    }

    static fromShape(shape, fill = 0) {
        return new Matrix(new Array(shape[0]).fill(fill).map(x => new Array(shape[1]).fill(fill)));
    }

    // slices a matrix given row and column start and end
    slice(rowStart, rowEnd, colStart, colEnd) {
        let result = this.data.slice(rowStart, rowEnd);
        for (let i = 0; i < result.length; i++) {
            result[i] = result[i].slice(colStart, colEnd)
        }
        return new Matrix(result);
    }

    // returns a copy of this matrix
    copy() {
        let data = new Array(this.shape[0]).fill(0).map(() => new Array(this.shape[1]).fill(0));
        for (let y = 0; y < this.shape[0]; y++) {
            for (let x = 0; x < this.shape[1]; x++) {
                data[y][x] = this.data[y][x];
            }
        }
        return new Matrix(data);
    }

    // splits the matrix into an array of (n, 1) vectors
    vectors() {
        let vectorArray = [];
        for (let x = 0; x < this.shape[1]; x++) {
            let data = [];
            for (let y = 0; y < this.shape[1]; y++) {
                data.push([this.data[y][x]])
            }
            vectorArray.push(new Matrix(data))
        }
        return vectorArray;
    }

    // flattens the matrix into a 1D array
    array() {
        let result = []
        for (let y = 0; y < this.shape[0]; y++) {
            for (let x = 0; x < this.shape[1]; x++) {
                result.push(this.data[y][x]);
            }
        }
        return result;
    }
}