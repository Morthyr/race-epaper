const text = "Hello, World!"

declare global {
    interface Window {
        canvasContext: CanvasRenderingContext2D | null
    }
}

export function bootstrap() {
    const canvasEl = document.createElement('canvas');
    document.body.appendChild(canvasEl);
    const canvasContext = canvasEl.getContext('2d');
    window.canvasContext = canvasContext;
}