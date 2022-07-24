
const canvas = document.querySelector('canvas')
console.log(canvas)
const ctx = canvas.getContext('2d')

canvas.width = 1200
canvas.height = 900



function draw(color){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rectWidth = 50
    const rectHeight = 30
    const leftX = Math.floor(Math.random() * 900);
    const leftY = Math.floor(Math.random() * 600);

    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = color;
    ctx.rect(leftX, leftY, rectWidth, rectHeight);
    ctx.stroke();
}

const element = document.getElementById('button')

// always checking if the element is clicked, if so, do alert('hello')
element.addEventListener("click", () => {
	draw("red")
});

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'z':
            draw("red")
            break
    }
  })