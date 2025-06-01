import './style.css'

// 1. Start the canvas
const canvas = document.querySelector('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

canvas.width = 1200;
canvas.height = 900;


// 2. Game Loop
function update() {
    draw()
    window.requestAnimationFrame(update)
}


function draw() {
    //Clear the screen
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0, canvas.width, canvas.height)

    drawTunnel()
}

update()


function drawTunnel() {
    const layers = 3 // Number of depth layers in the tunnel
    const centerX = canvas.width / 2 // X center of the canvas
    const centerY = canvas.height / 2 // Y center of the canvas
    const maxW = canvas.width // Maximum width of the outermost rectangle
    const maxH = canvas.height // Maximum height of the outermost rectangle

    let prev = null // This will store the previous layer's corners

    for (let i = 0; i <= layers; i++) {
        // Calculate how "deep" this layer is as a percentage (closer to 1 = closer to camera)
        let scale = 1 - i / (layers + 1)

        // Shrink width and height based on depth to simulate perspective
        let w = maxW * scale * 0.5
        let h = maxH * scale * 0.5

        // Calculate the four corners of the current rectangle
        let corners = {
            topLeft: [centerX - w, centerY - h],
            topRight: [centerX + w, centerY - h],
            bottomRight: [centerX + w, centerY + h],
            bottomLeft: [centerX - w, centerY + h]
        }

        // Set line color and thickness
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1

        // Draw the current rectangle
        ctx.beginPath()
        ctx.moveTo(corners.topLeft[0], corners.topLeft[1])
        ctx.lineTo(corners.topRight[0], corners.topRight[1])
        ctx.lineTo(corners.bottomRight[0], corners.bottomRight[1])
        ctx.lineTo(corners.bottomLeft[0], corners.bottomLeft[1])
        ctx.closePath()
        ctx.stroke()

        // If this is not the first layer, draw lines connecting corners to previous layer
        if (prev) {
            ctx.beginPath()

            // Connect top-left corners
            ctx.moveTo(prev.topLeft[0], prev.topLeft[1])
            ctx.lineTo(corners.topLeft[0], corners.topLeft[1])

            // Connect top-right corners
            ctx.moveTo(prev.topRight[0], prev.topRight[1])
            ctx.lineTo(corners.topRight[0], corners.topRight[1])

            // Connect bottom-right corners
            ctx.moveTo(prev.bottomRight[0], prev.bottomRight[1])
            ctx.lineTo(corners.bottomRight[0], corners.bottomRight[1])

            // Connect bottom-left corners
            ctx.moveTo(prev.bottomLeft[0], prev.bottomLeft[1])
            ctx.lineTo(corners.bottomLeft[0], corners.bottomLeft[1])

            ctx.stroke()
        }

        // Save the current layer's corners to connect on the next loop
        prev = corners
    }
}
