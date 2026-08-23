<img width="600" height="600" alt="utah_teapot_spinning" src="https://github.com/user-attachments/assets/4c3c3491-92c8-427a-81c5-3a56151c0284" /># Usage
To swap models between the Simple Cube and Utah Teapot, swap the respective model from the "models" subdirectory to "model" and comment out their respective code blocks in setup() and draw().
As a result of the differences between their dataset structures, this hard coded way is laziest

## Simple Cube
At small scales with only 8 points and 12 faces, imperfections in the simple Painter's Algorithm are painfully obvious:
<p align="center"><img width="600" height="600" alt="simple_cube_spinning" src="https://github.com/user-attachments/assets/07872fdc-916c-4672-993d-6231213c103b" /></p>
<div align="center">gifs/simple_cube_spinning.gif</div>

## Utah Teapot
At large scales with 18960 individual points, the imperfections are less obvious:
<p align="center"><img width="600" height="600" alt="utah_teapot_spinning" src="https://github.com/user-attachments/assets/cda2ca15-c6c3-4f18-a6be-f01c61822952" /></p>
<div align="center">gifs/utah_teapot_spinning.gif</div>






