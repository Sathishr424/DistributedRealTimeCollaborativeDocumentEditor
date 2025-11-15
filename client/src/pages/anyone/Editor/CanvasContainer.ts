export class CanvasContainer {
    private allCanvases: HTMLCanvasElement[] = [];
    private currentPage = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.allCanvases.push(canvas);
    }

    public getActiveCanvas() {
        return this.allCanvases[this.currentPage];
    }
}