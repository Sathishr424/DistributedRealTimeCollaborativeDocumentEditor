import {config} from "./interfaces/interfaces";

export class CanvasContainer {
    private allCanvases: HTMLCanvasElement[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.appendCanvas(canvas);
    }

    public getCanvasesTotal(): number {
        return this.allCanvases.length;
    }

    public getCanvas(index: number): HTMLCanvasElement {
        return this.allCanvases[index];
    }

    public clearCanvases(): void {
        console.log("Clear CanvasContainer");
        this.allCanvases.splice(0);
    }

    private loadConfig(canvas: HTMLCanvasElement) {
        const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        canvas.style.backgroundColor = config.backgroundColor;
        ctx.fillStyle = config.color;
        ctx.font = `${config.fontSize}px ${config.font}`;
    }

    public appendCanvas(canvas: HTMLCanvasElement): void {
        this.loadConfig(canvas);
        canvas.setAttribute("page", this.getCanvasesTotal().toString());
        this.allCanvases.push(canvas);
    }

    public popCanvas(): void {
        this.allCanvases.pop();
    }
}