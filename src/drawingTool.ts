const cannotDraw = "Cannot draw!"

interface ICache {
    drawIndicator: IDrawIndicatorArgs | null
}

interface IDrawIndicatorArgs {
    x: number,
    y: number
}

class Canvas {
    constructor(public context: CanvasRenderingContext2D | null) {
    }
    get width() { return this.context?.canvas.width || 100 };
    get height() { return this.context?.canvas.height || 100 };
}

export default class DrawingTool {
    private contexts: Canvas[]
    /**
     * Initialize the tool with @typedef {CanvasRenderingContext2D}
     */
    constructor(parentEl: HTMLElement, contexts: (CanvasRenderingContext2D | null)[], private gap: number) {
        this.contexts = contexts.map(c => new Canvas(c));
        this.drawGrid();
        parentEl.onmousemove = this.onMouseMove;
    }

    /**
     * Draws a grid system with specified gap
     * @property {number} gap as width and height
     */
    drawGrid() {
        const w = this.contexts[0].width;
        const h = this.contexts[0].height;
        const ctx = this.contexts[0].context
        if(ctx) {
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, w, h);
            ctx.save();
            ctx.restore();
            ctx.beginPath();
            
            for (let wi = 0; wi <= w; wi += this.gap) {
                ctx.moveTo(wi, 0);
                ctx.lineTo(wi, h);
            }

            for (let hi = 0; hi <= h; hi += this.gap) {
                ctx.moveTo(0, hi);
                ctx.lineTo(w, hi);
            }

            ctx.stroke();
            ctx.save();
        } else {
            console.log(cannotDraw);
        }
    }

    private cache: ICache = { 
        drawIndicator: null
    }

    drawIndicator(args: IDrawIndicatorArgs) {
        if(this.cache.drawIndicator?.x == args.x && this.cache.drawIndicator.y == args.y)
            return;
        
        this.cache.drawIndicator = args;

        const ctx = this.contexts[1].context;
        const w = this.contexts[1].width;
        const h = this.contexts[1].height;

        if(ctx) {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'grey';
            ctx.beginPath();
            ctx.arc(this.gap * args.x, this.gap * args.y, this.gap / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    onMouseMove = (e: MouseEvent) => {
        const x = Math.round(e.offsetX / this.gap);
        const y = Math.round(e.offsetY / this.gap);
        this.drawIndicator({ x, y });
    }
}