import './style.css'

/**
 * To run the webView: "npm run dev"
 * 
 * Inspiration game: MAZE WARS
 */

// 1. Start the canvas
const canvas = document.querySelector('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

canvas.width = 1200;
canvas.height = 900;

// Maze Layout
// 1 = path, 0 = wall
const maze = [
  [0,0,0,0,0,0,0],
  [0,1,1,1,1,1,0],
  [0,1,0,1,0,1,0],
  [0,0,0,1,0,1,0],
  [0,0,0,0,0,1,0],
  [0,1,1,1,1,1,0],
  [0,0,0,0,0,0,0]
]

// Player Position
let playerX = 1
let playerY = 1
let direction = 'E' // N, E, S, W


// Keyboard Input Handler
document.addEventListener("keydown", (e) => {
    if (e.key === 'a') {
        direction = turnLeft(direction)
    } else if (e.key === 'd') {
        direction = turnRight(direction)
    } else if (e.key === 'w') {
        // Try to move forward
        const {dx, dy} = moveDelta(direction)
        const newX = playerX + dx
        const newY = playerY + dy

        // Only move if next tile is a path(1)
        if (maze[newY]?.[newX] === 1) {
            playerX = newX
            playerY = newY
        }
    }
})

// Returns the new direction when turning left from the given direction
function turnLeft(dir) {
    return { N: 'W', W: 'S', S: 'E', E: 'N' }[dir]
}

// Returns the new direction when turning right from the given direction
function turnRight(dir) {
    return { N: 'E', E: 'S', S: 'W', W: 'N' }[dir]
}

// GET DIRECTION MOVEMENT
function moveDelta(dir) {
    if (dir === 'N') return {dx: 0, dy: -1}
    if (dir === 'S') return {dx: 0, dy: 1}
    if (dir === 'E') return {dx: 1, dy: 0}
    if (dir === 'W') return {dx: -1, dy: 0}
}

function draw() {
    //Clear the screen
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0, canvas.width, canvas.height)


    // Checks what the player sees
    let viewDistance = 8
    let x = playerX
    let y = playerY
    let {dx, dy} = moveDelta(direction)

    // Step forward tile by tile until a wall is found
    for (let i = 0; i < viewDistance; i++) {
        x += dx
        y += dy

        // If out of bounds or wall, draw up to this depth
        if (maze[y]?.[x] !== 1) {
        drawTunnel(i)
        return
        }
    }

    // If not wall hit, draw full tunnel
    drawTunnel(viewDistance)
}

function drawTunnel(depth) {
    // === [1] SETUP CONSTANTS ===
    const centerX = canvas.width / 2 // Center of canvas horizontally
    const centerY = canvas.height / 2 // Center of canvas vertically
    const fullWidth = canvas.width    // Total width of canvas
    const fullHeight = canvas.height  // Total height of canvas

    // This will store the corners of the previous rectangle (layer)
    let previousCorners = null

    // === [2] LOOP THROUGH EACH LAYER ===
    for (let i = 0; i <= depth; i++) {
        // Calculate how "far" this layer is (0 = closest, 1 = farthest)
        let scale = 1 - i / (depth + 1)

        // Shrink width and height based on depth to simulate perspective
        let rectWidth = fullWidth * scale * 0.5
        let rectHeight = fullHeight * scale * 0.5

        // === [3] CALCULATE CORNERS OF CURRENT RECTANGLE ===
        let tL = [centerX - rectWidth, centerY - rectHeight]
        let tR = [centerX + rectWidth, centerY - rectHeight]
        let bR = [centerX + rectWidth, centerY + rectHeight]
        let bL = [centerX - rectWidth, centerY + rectHeight]

        // === [4] DRAW CURRENT RECTANGLE OUTLINE ===
        ctx.strokeStyle = 'white' // Set line color
        ctx.lineWidth = 1         // Set line thickness
        if (i === depth) {
            // Only draw the full rectangle on the farthest wall
            ctx.beginPath()
            ctx.moveTo(...tL)
            ctx.lineTo(...tR)
            ctx.lineTo(...bR)
            ctx.lineTo(...bL)
            ctx.closePath()
            ctx.stroke()
        } else {
            // Draw only the vertical sides for inner tunnel layers
            ctx.beginPath()
            ctx.moveTo(...tL)
            ctx.lineTo(...bL)
            ctx.moveTo(...tR)
            ctx.lineTo(...bR)
            ctx.stroke()
        }


        // === [5] DRAW CONNECTING LINES TO PREVIOUS RECTANGLE ===
        if (previousCorners) {
            ctx.beginPath()

            // Connect matching corners from previous layer to current layer
            ctx.moveTo(...previousCorners.tL)
            ctx.lineTo(...tL)

            ctx.moveTo(...previousCorners.tR)
            ctx.lineTo(...tR)

            ctx.moveTo(...previousCorners.bR)
            ctx.lineTo(...bR)

            ctx.moveTo(...previousCorners.bL)
            ctx.lineTo(...bL)

            ctx.stroke()
        }

        // === [6] SAVE CURRENT CORNERS FOR NEXT LOOP ===
        previousCorners = { tL, tR, bR, bL}
    }
}


// 2. Game Loop
function update() {
    draw()
    window.requestAnimationFrame(update)
}

update()

/**
 * TODO 
 * 
 * Can be of use: https://www.youtube.com/watch?v=pNiyz0sl1no&t=2926s
 * 
 * Make a simple maze ✅// Example: https://youtu.be/nkpo7XCJMUY?t=295
 * Put the player in the maze ✅
 * Show the correct tunnel depending on the position of the player ✅
 * Allow the player movement reading the keystrokes (W A D) ✅ //The player cannot move if there is a wall in that direction
 * 
 * Automatic maze generator
 */