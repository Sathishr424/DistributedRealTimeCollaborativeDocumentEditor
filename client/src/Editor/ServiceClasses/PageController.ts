import {RenderViewport, Vec2} from "../utils/interfaces";
import {getElementPadding} from "../Helpers";
import {LayoutEngine} from "./LayoutEngine";
import {CanvasContainer} from "../CanvasContainer";
import {DocumentService} from "../DocumentService";
import RenderSubscription from "../utils/RenderSubscription";
import {Deque} from "@utils/Deque";
import {config} from "../../../../shared/config";

interface Viewport {
    startRow: number;
    endRow: number;
    startRowTriggerRerender: number;
    endRowTriggerRerender: number;
}

interface HeightRange {
    top: number;
    bottom: number;
}

export class PageController {
    private service: DocumentService;
    private canvasContainer: CanvasContainer;
    private layout: LayoutEngine
    private viewport: Viewport;
    private renderStackOperation: Deque<number>;

    constructor(service: DocumentService, canvasContainer: CanvasContainer, layout: LayoutEngine) {
        this.service = service;
        this.canvasContainer = canvasContainer;
        this.layout = layout;

        const heightRange = this.getCanvasBodyHeights();
        const startRow = this.calculateStartRow(heightRange.top);
        const endRow = this.calculateStartRow(heightRange.bottom);
        this.viewport = {
            startRow: startRow - config.viewportExtraRenderRows,
            endRow: endRow + config.viewportExtraRenderRows,
            startRowTriggerRerender: startRow - (config.viewportExtraRenderRows / 2),
            endRowTriggerRerender: endRow + (config.viewportExtraRenderRows / 2)
        }
        this.renderStackOperation = new Deque();
    }

    public initialRender() {
        this.rerenderViewport();
    }

    public rerenderViewport(): void {
        RenderSubscription.notify({
            startRow: Math.max(0, this.viewport.startRow),
            startCol: 0,
            endRow: Math.max(0, Math.min(this.viewport.endRow, this.getTotalPossibleRows())),
            endCol: 0
        });
    }

    private getCanvasBodyHeights(): HeightRange {
        const el = document.querySelector(config.canvasContainerBodyClass)!;
        return {top: el.scrollTop, bottom: el.scrollTop + el.clientHeight};
    }

    private calculateStartRow(scrollTop: number) {
        scrollTop = Math.floor(scrollTop);
        const page = Math.floor(scrollTop / this.layout.sizes.pageHeight) + 1;
        const remPageHeight = scrollTop % this.layout.sizes.pageHeight;

        let curr = Math.min(config.canvasMargin + config.canvasPadding, remPageHeight);
        let rem = remPageHeight - curr;

        let rows = Math.ceil(rem / (this.layout.sizes.height + config.fontPadding * 2));
        rows += (page - 1) * this.layout.sizes.rows

        return rows;
    }

    public onScroll(event: Event) {
        const heightRange = this.getCanvasBodyHeights();

        const startRow = this.calculateStartRow(heightRange.top);
        const endRow = this.calculateStartRow(heightRange.bottom);
        // console.log(startRow, endRow);

        const halfHeight = Math.floor(config.viewportExtraRenderRows / 2);

        this.viewport = {
            startRow: startRow - config.viewportExtraRenderRows,
            endRow: endRow + config.viewportExtraRenderRows,
            startRowTriggerRerender: startRow - halfHeight,
            endRowTriggerRerender: endRow + halfHeight
        }

        this.rerenderViewport();
    }

    public getPageCtxForRow(row: number): CanvasRenderingContext2D {
        let page = Math.floor(row / this.layout.sizes.rows);
        return this.getPageCtx(page)!;
    }

    public getTotalPossibleRows(): number {
        return this.getTotalPages() * this.layout.sizes.rows;
    }

    public isRowWithinThePages(row: number): boolean {
        let page = Math.floor(row / this.layout.sizes.rows);
        return page < this.getTotalPages();
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

    public convertToCanvasPos(pos: Vec2): Vec2 {
        const row = pos.y % this.layout.sizes.rows;
        return {x: pos.x * this.layout.sizes.charWidth, y: row * (this.layout.sizes.height + (config.fontPadding * 2))};
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

        x = Math.max(0, Math.min(this.layout.sizes.cols, Math.floor(x / this.layout.sizes.charWidth)));
        y = Math.min(this.layout.sizes.rows - 1, Math.floor(y / (this.layout.sizes.height + (config.fontPadding * 2))));
        y += (page * this.layout.sizes.rows);
        return {x, y};
    }
}