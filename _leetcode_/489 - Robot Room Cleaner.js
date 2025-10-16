/**
 * 
 * You are controlling a robot that is located somewhere in a room. The room is modeled as an m x n binary grid where 0 represents a wall and 1 represents an empty slot.

The robot starts at an unknown location in the room that is guaranteed to be empty, and you do not have access to the grid, but you can move the robot using the given API Robot.

You are tasked to use the robot to clean the entire room (i.e., clean every empty cell in the room). The robot with the four given APIs can move forward, turn left, or turn right. Each turn is 90 degrees.

When the robot tries to move into a wall cell, its bumper sensor detects the obstacle, and it stays on the current cell.

Design an algorithm to clean the entire room using the following APIs:

interface Robot {
  // returns true if next cell is open and robot moves into the cell.
  // returns false if next cell is obstacle and robot stays on the current cell.
  boolean move();

  // Robot will stay on the same cell after calling turnLeft/turnRight.
  // Each turn will be 90 degrees.
  void turnLeft();
  void turnRight();

  // Clean the current cell.
  void clean();
}

Note that the initial direction of the robot will be facing up. You can assume all four edges of the grid are all surrounded by a wall.

 
 * // This is the robot's control interface.
 * // You should not implement it, or speculate about its implementation
 * function Robot() {
 *     // Returns true if the cell in front is open and robot moves into the cell.
 *     // Returns false if the cell in front is blocked and robot stays in the current cell.
 *     @return {boolean}
 *     this.move = function() { ... };
 *
 *     // Robot will stay in the same cell after calling turnLeft/turnRight.
 *     // Each turn will be 90 degrees.
 *     @return {void}
 *     this.turnLeft = function() { ... };
 * 
 *     @return {void}
 *     this.turnRight = function() { ... };
 *
 *     // Clean the current cell.
 *     @return {void}
 *     this.clean = function() { ... };
 * };
 */

/**
 * @param {Robot} robot
 * @return {void}
 */

// Randomized moves... shouldve worked in C++

var cleanRoom = function (robot) {

    const setOfMoves = new Set()
    const backtrack = (robot, i, j, currentDirection) => {
        let key = `${i}->${j}`
        if (setOfMoves.has(key)) return; // already cleaned this cell

        // clean and add to set
        robot.clean();
        setOfMoves.add(key);

        for (let dirs = 0; dirs < 4; dirs++) {
            if (robot.move()) {
                let x = i, y = j;
                // 0: up
                // 90: right
                // 180: down
                // 270 or -90 : left
                // at starting of game, robot is up
                switch (currentDirection) {
                    case 0:
                        x = i - 1;
                        // go up, reduce row
                        break;
                    case 90:
                        y = j + 1
                        // go right increase col
                        break;
                    case 180:
                        x = i + 1
                        // go down, increas row
                        break;
                    case 270:
                        y = j - 1;
                        // go left
                        break;
                    default: break;
                }
                backtrack(robot, x, y, currentDirection)
                // a move has happened now we gotta store backpath
                robot.turnRight();
                robot.turnRight();
                robot.move()
                robot.turnRight()
                robot.turnRight();
                // back to original direction and cell.
            }

            // move to next direction
            robot.turnRight();
            currentDirection += 90;
            currentDirection %= 360 // within bounds.
        }
    }

    backtrack(robot, 0, 0, 0)
};

// https://leetcode.com/problems/robot-room-cleaner/solutions/396260/god-will-guide-your-steps-a-fully-randomized-algorithm/
// fully randomized algorithm for 1mil iterations will also solve the problem.

/*

var moveUp = function(robot){
    return robot.move()
}

var moveLeft = function(robot){
    robot.turnLeft()
    var ok = robot.move()
    robot.turnRight()
    return ok
}

var moveRight = function(robot){
    robot.turnRight()
    var ok = robot.move()
    robot.turnLeft()
    return ok
}

var moveDown = function(robot){
    robot.turnRight()
    robot.turnRight()
    var ok = robot.move()
    robot.turnLeft()
    robot.turnLeft()
    return ok
}

var cleanCell = function(robot, visited, x, y){
    var id = x+","+y;
    if(visited[id]){
        return;
    }
    robot.clean()
    visited[id] = 1
    if(moveUp(robot)){
        cleanCell(robot, visited, x,y-1)
        moveDown(robot)
    }
    if(moveLeft(robot)){
        cleanCell(robot, visited, x-1,y)
        moveRight(robot)
    }
    if(moveRight(robot)){
        cleanCell(robot, visited, x+1,y)
        moveLeft(robot)
    }
    if(moveDown(robot)){
        cleanCell(robot, visited, x,y+1)
        moveUp(robot)
    }
    
}

var cleanRoom = function(robot) {
    visited = {}
    cleanCell(robot, visited, 0, 0)
};
*/