# Usage
To swap models between the Simple Cube and Utah Teapot, swap the respective model from the "models" subdirectory to "model" and comment out their respective code blocks in setup() and draw().
As a result of the differences between their dataset structures, this hard coded way is laziest

## Simple Cube
At small scales with only 8 points and 12 faces, imperfections in the simple Painter's Algorithm are painfully obvious:
<p align="center"><img width="600" height="600" alt="simple_cube_spinning" src="https://github.com/user-attachments/assets/07872fdc-916c-4672-993d-6231213c103b" /></p>
<div align="center"><span style="font-size: 6px;">gifs/simple_cube_spinning.gif</span></div>

