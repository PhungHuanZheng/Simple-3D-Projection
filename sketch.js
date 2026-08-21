let angle = 0

let mySceneObject1;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    const points = [
        new Point(-0.5, -0.5, -0.5),
        new Point(0.5, -0.5, -0.5),
        new Point(0.5, 0.5, -0.5),
        new Point(-0.5, 0.5, -0.5),
        new Point(-0.5, -0.5, 0.5),
        new Point(0.5, -0.5, 0.5),
        new Point(0.5, 0.5, 0.5),
        new Point(-0.5, 0.5, 0.5),
    ]

    // POINTS ARRANGES IN CCW
    mySceneObject1 = new SceneObject([
        new Face(points[0], points[1], points[2]),
        new Face(points[2], points[3], points[0]),

        new Face(points[4], points[7], points[6]),
        new Face(points[6], points[5], points[4]),

        new Face(points[0], points[4], points[5]),
        new Face(points[5], points[1], points[0]),

        new Face(points[2], points[6], points[7]),
        new Face(points[7], points[3], points[2]),

        new Face(points[0], points[3], points[7]),
        new Face(points[7], points[4], points[0]),

        new Face(points[1], points[5], points[6]),
        new Face(points[6], points[2], points[1]),
    ])

    // // cube made of triangle faces
    // mySceneObject1 = new SceneObject([
    //     new Face(new Point(0.5, 0.5, -0.5), new Point(-0.5, 0.5, -0.5), new Point(0.5, -0.5, -0.5)),
    //     new Face(new Point(-0.5, -0.5, -0.5), new Point(-0.5, 0.5, -0.5), new Point(0.5, -0.5, -0.5)),

    //     new Face(new Point(0.5, 0.5, 0.5), new Point(-0.5, 0.5, 0.5), new Point(0.5, -0.5, 0.5)),
    //     new Face(new Point(-0.5, -0.5, 0.5), new Point(-0.5, 0.5, 0.5), new Point(0.5, -0.5, 0.5)),

    //     new Face(new Point(0.5, 0.5, -0.5), new Point(0.5, -0.5, -0.5), new Point(0.5, -0.5, 0.5)),
    //     new Face(new Point(0.5, 0.5, 0.5), new Point(0.5, -0.5, 0.5), new Point(0.5, 0.5, -0.5)),

    //     new Face(new Point(-0.5, 0.5, -0.5), new Point(-0.5, -0.5, -0.5), new Point(-0.5, -0.5, 0.5)),
    //     new Face(new Point(-0.5, 0.5, 0.5), new Point(-0.5, -0.5, 0.5), new Point(-0.5, 0.5, -0.5)),

    //     new Face(new Point(0.5, 0.5, -0.5), new Point(-0.5, 0.5, -0.5), new Point(0.5, 0.5, 0.5)),
    //     new Face(new Point(0.5, -0.5, -0.5), new Point(-0.5, -0.5, -0.5), new Point(0.5, -0.5, 0.5)),

    //     new Face(new Point(-0.5, 0.5, -0.5), new Point(-0.5, 0.5, 0.5), new Point(0.5, 0.5, 0.5)),
    //     new Face(new Point(-0.5, -0.5, -0.5), new Point(-0.5, -0.5, 0.5), new Point(0.5, -0.5, 0.5)),
    // ]);
}

function draw() {
    background(0);

    mySceneObject1.pipeline(
        [Matrix.translate, [0, 0, 0]],
        [Matrix.scale, 1],
        [Matrix.rotateXZ, angle],
        // [Matrix.rotateYZ, angle],
        // [Matrix.rotateXY, angle],
    )

    strokeWeight(1)
    mySceneObject1.render()

    angle += 1 / frameRate();
    
    // draw framerate
    fill(255); noStroke(); textSize(20)
    text(`${frameRate().toFixed(0)}/60 FPS`, 5, 20)
}