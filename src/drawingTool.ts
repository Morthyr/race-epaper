const cannotDraw = "Cannot draw!"

interface ICache {
    drawIndicator: IDrawIndicatorArgs | null
    drawArrow: IDrawArrowArgs | null
}

interface IDrawArgs {
    x: number,
    y: number,
    allowMulti?: boolean,
    style: string
}
interface IDrawIndicatorArgs extends IDrawArgs { }
interface IDrawArrowArgs extends IDrawArgs {
    x1: number,
    y1: number
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
        drawIndicator: null,
        drawArrow: null
    }

    drawIndicator(args: IDrawIndicatorArgs) {
        const dic = this.cache.drawIndicator
        if(dic?.x == args.x && dic.y == args.y)
            return;
        
        this.cache.drawIndicator = args;

        const ctx = this.contexts[1].context;
        const w = this.contexts[1].width;
        const h = this.contexts[1].height;

        if(ctx) {
            if(!args.allowMulti) {
                ctx.clearRect(0, 0, w, h);
            }
            ctx.fillStyle = args.style;
            ctx.beginPath();
            ctx.arc(this.gap * args.x, this.gap * args.y, this.gap / 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    drawArrow(args: IDrawArrowArgs) {
        const dac = this.cache.drawArrow
        if(dac?.x == args.x && dac.y == args.y 
            && dac.x1 == args.x1 && dac.y1 == args.y1)
            return;
        
        this.cache.drawArrow = args;

        const ctx = this.contexts[2].context;
        const w = this.contexts[2].width;
        const h = this.contexts[2].height;

        if(ctx) {
            if(!args.allowMulti) {
                ctx.clearRect(0, 0, w, h);
            }
            ctx.lineWidth = 3;
            ctx.strokeStyle = args.style;
            this.drawLineWithArrows(ctx, this.gap * args.x, this.gap * args.y,
                this.gap * args.x1, this.gap * args.y1);
        }
    }

    /**
     * x0, y0: the line's starting point
     * x1,y1: the line's ending point
     * width: the distance the arrowhead perpendicularly extends away from the line
     * height: the distance the arrowhead extends backward from the endpoint
     * arrowStart: true/false directing to draw arrowhead at the line's starting point
     * arrowEnd: true/false directing to draw arrowhead at the line's ending point
     */
    private drawLineWithArrows(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
        const aWidth = 5, aLength = 8;

        var dx=x1-x0;
        var dy=y1-y0;
        var angle=Math.atan2(dy,dx);
        var length=Math.sqrt(dx*dx+dy*dy);
        //
        ctx.translate(x0,y0);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(length,0);
        
        // arrow
        ctx.moveTo(length-aLength,-aWidth);
        ctx.lineTo(length,0);
        ctx.lineTo(length-aLength,aWidth);
        
        //
        ctx.stroke();
        ctx.setTransform(1,0,0,1,0,0);
    }

    getCoord = (e: MouseEvent) => {
        return { 
            x: Math.round(e.offsetX / this.gap),
            y: Math.round(e.offsetY / this.gap)
        };
    }

    onMouseMove = (e: MouseEvent) => {
        const { x, y } = this.getCoord(e);
        this.drawIndicator({ x, y, style: 'grey' });
        this.drawArrow({ x: 10, y: 3, x1: x, y1: y, style: 'green' });
    }
}