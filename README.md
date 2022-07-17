# Maze-Generator-and-Solver

Thanks for visiting Maze-Generator-and-Solver!!! This project was created because I wanted to see how maze generation and solving algorithms worked in action. To access it, go to this page and use Google Chrome: https://blueninja7.github.io/Maze-Generator-and-Solver/Maze-Generator-and-Solver

## Algorithms Implemented

### Maze Generation

#### Recursive Backtracking Algorithm 
The recursive backtracker algorithm is a randomized version of the depth-first search algorithm. In this we randomly visit the cell in grid and mark them visited. This will continue until it finds the cell who do not have an unvisited neighboring cell. When it is at cell where all neighboring cells are visited, it will backtrack through the path until it reaches a cell with an unvisited neighbor, continuing the path generation by visiting this new, unvisited cell. This will continue until it visits all the cell in grid. Once it visits last cell it will backtrack it to the start point. 

#### Recursive Division Algorithm
Recursive Division algorithm treats the maze as a fractal repeating pattern whose component parts are like the whole. It splits the grid into two sub grids, putting a wall between them and a single opening in it, linking the sub-grids together, and then recursively repeats this process until the width or height of one of the parts is one cell. 

### Maze Solver

#### A* Algorithm 
The A* algorithm tries to explore in a direction which is closer to the target node. This is done by using heuristic which should be consistent as well as admissible in contemplation with the problem. The A* expands a node (n) for which the following function gives the minimum value: f(n) = g(n) + h(n).
Here the function g(n) is the cost involved to travel from start to the current node and h(n) is the heuristic function is used to get the straight-line distance from  current node to the target node.

#### Bidirectional Search
Bidirectional Search algorithm is similar to depth first search algorithm. This search runs simultaneously from start point to target point. In this we start randomly from start point visiting the cells. When there is a dead-end, we backtrack to the cell who has adjacent unvisited cell. Simultaneously this process is carried out from the target point as well. When the current cell of both the search are the same, we find the path between the start and target point. 
