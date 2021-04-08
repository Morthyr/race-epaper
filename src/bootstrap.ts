import DrawingTool from "./drawingTool";

const text = "Hello, World!"

declare global {
    interface Window {
        drawingTool: DrawingTool
    }
}

var layers = 0
const addContextLayer = (parentEl: HTMLElement) => {
    const id = layers;
    layers++;

    const canvasEl = document.createElement("canvas");
    canvasEl.id = "layer" + id;
    canvasEl.width = 800;
    canvasEl.height = 500;

    const style = canvasEl.style;
    style.zIndex = id.toString();
    style.position = "absolute";
    style.left = "0";
    style.top = "0";

    parentEl.appendChild(canvasEl);
    return canvasEl.getContext('2d');
}

export function bootstrap() {
    let parentEl = document.getElementById("canvas-parent");
    if(parentEl == null){
        parentEl = document.createElement("div")
        document.body.appendChild(parentEl);
    } 
    const contexts = [
        addContextLayer(parentEl),
        addContextLayer(parentEl),
        addContextLayer(parentEl)
    ];
    const gap = 20;
    const drawingTool = new DrawingTool(parentEl, contexts, gap);
    window.drawingTool = drawingTool;
}