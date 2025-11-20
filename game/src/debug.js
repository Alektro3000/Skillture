
function drawSquare(mx, bound) {

    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    ctx.beginPath()
    const conv = currentProjection.convertWorldToPX
    const pot = conv(mx)
    ctx.moveTo(pot.x + 300, pot.y + 300)

    const pot4 = conv(mx.add(new Point(0,bound.y)))
    ctx.lineTo(pot4.x + 300, pot4.y  + 300)

    const pot3 = conv(mx.add(new Point(bound.x,bound.y)))
    ctx.lineTo(pot3.x + 300, pot3.y + 300)

    const pot2 = conv(mx.add(new Point(bound.x,0)))
    ctx.lineTo(pot2.x + 300, pot2.y + 300)

    const pot1 = conv(mx)
    ctx.lineTo(pot1.x + 300, pot1.y + 300)
    
    ctx.stroke()
}

function drawFurnitureBox(worldFurniture) {
    if(currentProjection.getName() != "iso")
        return;
    const mx = worldFurniture.getMinPoint();
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0,0,6000,6000)

    drawSquare(mx, worldFurniture.data.getBoundingBox())
    drawSquare(mx.add(new Point(0,0,worldFurniture.data.getBoundingBox().z)), worldFurniture.data.getBoundingBox())
}

function clearCanvas() {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0,0,6000,6000)
}