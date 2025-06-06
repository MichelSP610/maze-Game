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

canvas.width = 700;
canvas.height = 500;


const mazeLayout = [
[0,0,0,0,0,0,0],
[0,1,1,1,1,1,0],
[0,1,0,1,0,1,0],
[0,0,0,1,0,1,0],
[0,0,0,0,0,1,0],
[0,1,1,1,1,1,0],
[0,0,0,0,0,0,0]
]

let currentLayers = 5

document.addEventListener("keyup", (e) => {
    console.log(`Key "${e.key}" pressed`)
    if (e.key === "w") {
        currentLayers -= 1
    } else if (e.key === "s") {
        currentLayers = Math.max(1, currentLayers + 1)
    }
})

// 2. Game Loop
function update() {
    draw()
    window.requestAnimationFrame(update)
}


function draw() {
    //Clear the screen
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0, canvas.width, canvas.height)

    drawTunnel(currentLayers)
}

update()


/**
 * TODO 
 * 
 * Can be of use: https://www.youtube.com/watch?v=pNiyz0sl1no&t=2926s
 * 
 * Make a simple maze ✅// Example: https://youtu.be/nkpo7XCJMUY?t=295
 * Put the player in the maze 
 * Show the correct tunnel depending on the position of the player
 * Allow the player movement reading the keystrokes (W A D) //The player cannot move if there is a wall in that direction
 * 
 * Automatic maze generator
 */

function drawTunnel(distance) {
    // === [1] SETUP CONSTANTS ===
    const layers = distance // Number of "depth steps" in the tunnel
    const centerX = canvas.width / 2 // Center of canvas horizontally
    const centerY = canvas.height / 2 // Center of canvas vertically
    const fullWidth = canvas.width    // Total width of canvas
    const fullHeight = canvas.height  // Total height of canvas

    // This will store the corners of the previous rectangle (layer)
    let previousCorners = null

    // === [2] LOOP THROUGH EACH LAYER ===
    for (let i = 0; i <= layers; i++) {
        // Calculate how "far" this layer is (0 = closest, 1 = farthest)
        let scale = 1 - i / (layers + 1)

        // Shrink width and height based on depth to simulate perspective
        let rectWidth = fullWidth * scale * 0.5
        let rectHeight = fullHeight * scale * 0.5

        // === [3] CALCULATE CORNERS OF CURRENT RECTANGLE ===
        let topLeft     = [centerX - rectWidth, centerY - rectHeight]
        let topRight    = [centerX + rectWidth, centerY - rectHeight]
        let bottomRight = [centerX + rectWidth, centerY + rectHeight]
        let bottomLeft  = [centerX - rectWidth, centerY + rectHeight]

        // === [4] DRAW CURRENT RECTANGLE OUTLINE ===
        ctx.strokeStyle = 'white' // Set line color
        ctx.lineWidth = 1         // Set line thickness
        ctx.beginPath()
        ctx.moveTo(...topLeft)
        ctx.lineTo(...topRight)
        ctx.lineTo(...bottomRight)
        ctx.lineTo(...bottomLeft)
        ctx.closePath()
        ctx.stroke()

        // === [5] DRAW CONNECTING LINES TO PREVIOUS RECTANGLE ===
        if (previousCorners) {
            ctx.beginPath()

            // Connect matching corners from previous layer to current layer
            ctx.moveTo(...previousCorners.topLeft)
            ctx.lineTo(...topLeft)

            ctx.moveTo(...previousCorners.topRight)
            ctx.lineTo(...topRight)

            ctx.moveTo(...previousCorners.bottomRight)
            ctx.lineTo(...bottomRight)

            ctx.moveTo(...previousCorners.bottomLeft)
            ctx.lineTo(...bottomLeft)

            ctx.stroke()
        }

        // === [6] SAVE CURRENT CORNERS FOR NEXT LOOP ===
        previousCorners = {
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        }
    }
}
