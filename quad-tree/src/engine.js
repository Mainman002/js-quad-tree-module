// Imports
import {Point, Rectangle, QuadTree} from "../src/modules/qTree.js";

// Quad Tree
const boundary = new Rectangle(200, 200, 200, 200);
const qTree = new QuadTree(boundary, 4);

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

// Graphic sharpness
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

// Variables
const mouse = {
    x:0,
    y:0,
    pressed:false
}

globalThis.areaObject = [];
// let objects = [];


document.addEventListener('mousedown', e => {
    mouse.pressed = true;
});


document.addEventListener('mouseup', e => {
    mouse.pressed = false;
    // const tempPoint = [];
    console.log(`Clicked: ${JSON.stringify(areaObject)}`);
});


document.addEventListener('mouseleave', e => {
    mouse.x = undefined;
    mouse.y = undefined;
});


document.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;

    draw();
});


// Draw points
for (let i = 0; i < 127; i++){
    // let p =  new Point(Math.random() * 300+i , Math.random() * 300+i);
    let x = Math.random() * 300 + 32;
    let y = Math.random() * 300 + 32;
    let p = new Point(x, y);
    // objects.push(p);
    qTree.insert(p);
}


function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    qTree.show(canvas, ctx);

    const range = new Rectangle(mouse.x,mouse.y,32,32);
    let points = [];

    ctx.lineWidth = 1;
    ctx.strokeStyle = "Black";
    ctx.strokeRect(0,0,canvas.width,canvas.height);

    ctx.lineWidth = 3;
    ctx.rectMode = 'center';
    ctx.strokeStyle = "Teal";
    ctx.strokeRect(range.x-range.w, range.y-range.h, range.w*2, range.h*2);

    points = qTree.query(range);
    areaObject = points;

    if (mouse && points){
    
        console.log(`Hovered: ${JSON.stringify(areaObject)}`);

        for (let p of points){
            ctx.lineWidth = 3;
            ctx.rectMode = 'center';
            ctx.strokeStyle = "Gold";
            ctx.strokeRect(p.x, p.y, 4, 4);
        }
    }
}

draw();
