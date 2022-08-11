let color = '#000000';

const cPicker = document.querySelector('input');
cPicker.addEventListener('change', () => {
    color = cPicker.value
})

const canvas = new fabric.Canvas('canvas', {
    position:"absolute",
    top:50,
    width: 1000,
    height: 500,
})

const rec = document.querySelector('.rect')
rec.addEventListener( 'click' , () => {
    random = Math.random();
    const rect = new fabric.Rect({
        id: random,
        top: 100,
        left: 400,
        width: 60,
        height: 70,
        fill: color,
        stroke : 'black',
        strokeWidth : 1,
    });
    canvas.add(rect);
})

const circle = document.querySelector('.circle')
circle.addEventListener('click' ,() => {
    const circle = new fabric.Circle( {
        top: 100, left: 400,
        radius: 50, 
        fill: color,
        stroke : 'black',
        strokeWidth : 1
    } );
    canvas.add(circle)
})

const triangle = document.querySelector('.triangle')
triangle.addEventListener('click' ,() => {
    const triangle = new fabric.Triangle( {
        top: 60, left: 50,
        width: 80, height: 90, fill: color,
        stroke : 'black',
        strokeWidth : 1,
    } );
    canvas.add(triangle)
})

const line = document.querySelector('.line')
line.addEventListener('click' ,() => {
    const line = new fabric.Line( [ 50, 50, 200, 50 ], {
        strokeWidth: 2,
        stroke: color
      } );
    canvas.add(line)
})

const freeDraw = document.querySelector('.free-draw')
freeDraw.addEventListener('click', () => {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 5;
        canvas.freeDrawingBrush.color = color;
        canvas.on('mouse:up', () => {
        canvas.isDrawingMode = false;
    })
})

const text = document.querySelector('.text')
text.addEventListener('click', () => {
    canvas.add(new fabric.IText('click here', { 
        fontFamily: 'arial',
        left: 100, 
        top: 100 ,
        fill: color
      }));
})

const clear = document.querySelector('.clear')
clear.addEventListener('click', () => {canvas.clear();})


canvas.renderAll();