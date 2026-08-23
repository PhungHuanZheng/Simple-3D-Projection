class SceneObject {
    constructor(faces) {
        this.faces = faces;

        this.pointCount = this.faces.length * 3;
        this.origin = null;
    }

    // does the same as Point's pipeline but also passes it through a projection matrix
    pipeline(...args) {
        let [xSum, ySum, zSum] = [0, 0, 0];

        for (let face of this.faces) {
            this.updateFace(face);

            // do pipeline for faces points
            for (let point of face.points) {
                point.pipeline(...args);
                point.project();

                // calculate center point of object before transformation and pass the matrix
                // through the pipeline. origin will be a point object
                xSum += point.initPos.at(0, 0);
                ySum += point.initPos.at(1, 0);
                zSum += point.initPos.at(2, 0);
            }
        }

        // initial origin point -> pipeline
        this.origin = new Point(
            xSum / this.pointCount,
            ySum / this.pointCount,
            zSum / this.pointCount
        );
        this.origin.pipeline(...args);
        this.origin.project();
    }

    // update properties for faces to be used in rendering calculations (draw order etc)
    updateFace(face) {
        // left blank for fun :)
    }

    // helper function for render()
    #overlap1D(min1, max1, min2, max2) {
        return !(max1 < min2 || max2 < min1);
    }

    // renders a skeleton of the scene object
    renderSkeleton() {
        for (let face of this.faces) {
            face.origin.render(255, 255, 255);
            for (let point of face.points) {
                // circle(point.projPos.x, point.projPos.y, 7);
                for (let other of face.points) {
                    if (point === other) continue;
                    stroke(255);
                    line(point.projPos.x, point.projPos.y, other.projPos.x, other.projPos.y);
                }
            }
        }
        this.origin.render(255, 0, 0);
    }

    // renders the scene object fully
    render() {
        // sort faces by distance from camera https://en.wikipedia.org/wiki/Painter%27s_algorithm
        // since z value is just distance from camera, use raw z
        for (let face of this.faces) {
            let x_values = [];
            let y_values = [];
            let z_values = [];
            for (let point of face.points) {
                x_values.push(point.truePos.at(0, 0))
                y_values.push(point.truePos.at(1, 0))
                z_values.push(point.truePos.at(2, 0))
            }
            face.min_x = Math.min(...x_values);
            face.max_x = Math.max(...x_values);
            face.min_y = Math.min(...y_values);
            face.max_y = Math.max(...y_values);
            face.min_z = Math.min(...z_values);
            face.max_z = Math.max(...z_values);
        }

        // initial rough sort
        let sortedFaces = this.faces.sort((a, b) => a.min_z - b.min_z);

        // overlap validation loop https://www.google.com/search?client=firefox-b-d&q=do+i+use+the+center+of+a+facee+for+painters+algorithm&fbs=ABfTbFVyMZGZf1hfvX9uKjN_-G8c4u0nXx4bEIpwm1lnNH832a9BVCEiB2iPJNekNderQwJGZIG7YID1eBGNWasq2rzBCKvcT3x25S8SEXDCqQ_cJJzhLdoECr8RjBicCWQnIEMsOnpkovzMzmqc4Kw9XmIujNC-d_nfho9XQuPicfBd4ZwwOWuaR3DW9zS47o53POxXR-G_qNyoprKd6QUxoLSuDrrj2g&aep=10&ntc=1&sxsrf=APpeQntlmeg9eMtz0p6_eY1BhqtPkUCV1w%3A1787288046490&mstk=AUtExfBDgn5nqLeqEk99AB4EsKgNS5_Khw92tDrfa_zkHS1wm43d7t30MbymX9eem4AYofOUjxnZbgDQObOlOAAPhnZlTiko5LeySNgrKZO0CgCK3YzykezjGS-C3eAsdHpt7ddUDyraI3BCVG09YNHGS-zGX5-uPBJHD2ROZa7sE7l1IXyydQaCC5Fghgl8RXwsQF9CURvrjlQaDyb_GicS5gAz1Tk-jBXOrifR727ntYdX-BhZboLlhPBr7Qp5cE4QBfmfwxjIfxLbeZ0F0Tf6GmzyE6YB1O5F1pGFHvwm8k_1F3tHCJdflbgs61ksFC-7QQV-l6v6yMQ_ig&aioh=3&csuir=1&atvm=2&mtid=WN2HarLyBJqX4-EPutHW4AY&udm=50
        for (let i = 0; i < sortedFaces.length; i++) {
            let face_A = sortedFaces[i];
            for (let j = i + 1; j < sortedFaces.length; j++) {
                let face_B = sortedFaces[j];

                // optimization: if B furthest is closer than A closest, they dont overlap at all and B is completely in front
                if (face_B.min_z >= face_A.max_z) 
                    continue;

                // if z overlaps, check other coordinates
                let overlap_x = this.#overlap1D(face_A.min_x, face_A.max_x, face_B.min_x, face_B.max_x);
                let overlap_y = this.#overlap1D(face_A.min_y, face_A.max_y, face_B.min_y, face_B.max_y);

                // if no other overlap, drawing order doesnt matter
                if (!(overlap_x && overlap_y))
                    continue;

                // If B is actually behind A globally, shift B to be drawn before A.
                if (face_B.max_z < face_A.max_z) {
                    // swap faces that intersect such that front face is drawn last
                    let temp = sortedFaces[j];
                    sortedFaces.splice(j, 1);
                    sortedFaces.splice(i, 0, temp);
                    i--;
                    break;
                }
            }
        }
        
        for (let face of sortedFaces) {
            // if facing away from camera, dont render
            if (face.isBackFace()) 
                continue;

            beginShape(TRIANGLES);

            fill(face.colour); noStroke()
            vertex(face.points[0].projPos.x, face.points[0].projPos.y, face.points[0].projPos.z);
            vertex(face.points[1].projPos.x, face.points[1].projPos.y, face.points[1].projPos.z);
            vertex(face.points[2].projPos.x, face.points[2].projPos.y, face.points[2].projPos.z);

            endShape();
        }
    }
}