let angle = 0;

let data;
let mySceneObject1;


function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    // break down UTAH TEAPOT data file
    // for (let i = 0; i < points.length; i++) {
    //     points[i] = new Point(...points[i]);
    // }
    // for (let i = 0; i < faces.length; i++) {
    //     faces[i] = new Face(points[faces[i][0] - 1], points[faces[i][2] - 1], points[faces[i][1] - 1]);
    // }
    // mySceneObject1 = new SceneObject(faces);

    // breakdown SIMPLE CUBE data file
    for (let i = 0; i < points.length; i++) {
        points[i] = new Point(...points[i]);
    }
    for (let i = 0; i < faces.length; i++) {
        faces[i] = new Face(points[faces[i][0]], points[faces[i][1]], points[faces[i][2]]);
    }
    mySceneObject1 = new SceneObject(faces);
}

function draw() {
    background(0);

    // utah teapot
    // mySceneObject1.pipeline(
    //     [Matrix.translate, [0, -0.65, 0]],
    //     [Matrix.scale, 0.4],
    //     [Matrix.rotateXZ, angle / 5],
    //     [Matrix.rotateYZ, Math.PI],
    // )

    // simple cube
    mySceneObject1.pipeline(
        [Matrix.scale, 1],
        [Matrix.rotateXZ, angle],
        [Matrix.rotateYZ, Math.PI],
    )

    strokeWeight(1)
    mySceneObject1.render();

    angle += 1 / frameRate();
    
    // draw framerate
    fill(255); noStroke(); textSize(20)
    text(`${frameRate().toFixed(0)}/60 FPS`, 5, 20)
}