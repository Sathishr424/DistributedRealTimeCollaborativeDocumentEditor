import {Vec2} from "../utils/interfaces";
import {getElementPadding} from "../Helpers";
import {LayoutEngine} from "./LayoutEngine";
import {CanvasContainer} from "../CanvasContainer";
import {DocumentService} from "../DocumentService";

export class PageController {
    private service: DocumentService;
    private canvasContainer: CanvasContainer;
    private layout: LayoutEngine

    constructor(service: DocumentService, canvasContainer: CanvasContainer, layout: LayoutEngine) {
        this.service = service;
        this.canvasContainer = canvasContainer;
        this.layout = layout;
    }

    public getPageCtxForRow(row: number): CanvasRenderingContext2D {
        let page = Math.floor(row / this.layout.sizes.rows);
        return this.getPageCtx(page)!;
    }

    public getTotalPages(): number {
        return this.canvasContainer.getCanvasesTotal();
    }

    public getPageCtx(page: number) {
        return this.canvasContainer.getCanvas(page).getContext('2d')
    }

    public handlePages() {
        const pos = this.layout.getLastCharPosition();
        const pages = Math.floor(pos.y / this.layout.sizes.rows);
        // console.log("PAGES:", pos, pages, this.canvasContainer.getCanvasesTotal())

        while (this.canvasContainer.getCanvasesTotal() <= pages) {
            this.canvasContainer.appendCanvasNew(this.service);
        }
        while (this.canvasContainer.getCanvasesTotal() > pages + 1) {
            this.canvasContainer.popCanvas();
        }

        this.service.updateLiveCursorPosition();
    }

    public getPagePosition(e: MouseEvent): Vec2 {
        let x = e.clientX;
        let y = e.clientY;

        // @ts-ignore
        let page = parseInt(e.target.getAttribute('page'));
        const canvas = this.canvasContainer.getCanvas(page);

        const {left, top} = canvas.getBoundingClientRect();
        const padding = getElementPadding(canvas);

        x -= left + padding.x;
        y -= top + padding.y;
        x += (x % this.layout.sizes.charWidth);

        return {x: Math.max(0, Math.min(this.layout.sizes.cols, Math.floor(x / this.layout.sizes.charWidth))), y: Math.min(this.layout.sizes.rows - 1, Math.floor(y / this.layout.sizes.height)) + (page * this.layout.sizes.rows)};
    }
}