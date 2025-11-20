import {config, RenderViewport, Vec2} from "../utils/interfaces";
import {getElementPadding} from "../Helpers";
import {LayoutEngine} from "./LayoutEngine";
import {CanvasContainer} from "../CanvasContainer";
import {DocumentService} from "../DocumentService";
import RenderSubscription from "../utils/RenderSubscription";

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

    constructor(service: DocumentService, canvasContainer: CanvasContainer, layout: LayoutEngine) {
        this.service = service;
        this.canvasContainer = canvasContainer;
        this.layout = layout;

        const heightRange = this.getCanvasBodyHeights();
        const startRow = this.calculateStartRow(heightRange.top);
        const endRow = this.calculateStartRow(heightRange.bottom);
        this.viewport = {
            startRow: startRow - config.viewportExtraRenderHeight,
            endRow: endRow + config.viewportExtraRenderHeight,
            startRowTriggerRerender: startRow - (config.viewportExtraRenderHeight / 2),
            endRowTriggerRerender: endRow + (config.viewportExtraRenderHeight / 2)
        }
        console.log(this.viewport)
    }

    public initialRender() {
        RenderSubscription.notify({
            startRow: this.viewport.startRow,
            startCol: 0,
            endRow: this.viewport.endRow,
            endCol: 0
        });
    }

    public rerenderViewport(): void {
        RenderSubscription.notify({
            startRow: this.viewport.startRow,
            startCol: 0,
            endRow: this.viewport.endRow,
            endCol: 0
        });
    }

    private getCanvasBodyHeights(): HeightRange {
        const el = document.querySelector(config.canvasContainerBodyClass)!;
        return {top: el.scrollTop, bottom: el.scrollTop + el.clientHeight};
    }

    private calculateStartRow(scrollTop: number) {
        const page = Math.floor(scrollTop / this.layout.sizes.pageHeight) + 1
        const remPageHeight = scrollTop % this.layout.sizes.pageHeight;
        // Current page top padding
        let startRow = Math.min(config.canvasPadding + config.canvasMargin, remPageHeight);
        // Current page bottom config.canvasPadding
        startRow += Math.min(config.canvasPadding + config.canvasMargin, Math.max(0, remPageHeight - (config.canvasHeight + config.canvasMargin + config.canvasPadding)));
        // Previous pages padding and margin
        startRow += (page - 1) * ((config.canvasMargin + config.canvasPadding) * 2);
        // And finally we get the total accurate rows
        startRow = scrollTop - startRow;
        startRow = Math.ceil(startRow / config.lineHeight);
        return startRow;
    }

    public onScroll(event: Event) {
        const heightRange = this.getCanvasBodyHeights();

        const startRow = this.calculateStartRow(heightRange.top);
        const endRow = this.calculateStartRow(heightRange.bottom);

        const halfHeight = Math.floor(config.viewportExtraRenderHeight / 2);
        if (startRow <= this.viewport.startRowTriggerRerender) {
            // console.log(this.viewport)
            this.viewport.startRow -= halfHeight;
            this.viewport.startRowTriggerRerender -= halfHeight;
            this.viewport.endRow -= halfHeight;
            this.viewport.endRowTriggerRerender -= halfHeight;
            // console.log(halfHeight, this.viewport);

            // Trigger render of the top
            RenderSubscription.notify({
                startRow: this.viewport.startRow,
                startCol: 0,
                endRow: this.viewport.startRowTriggerRerender,
                endCol: 0
            });
        } else if (endRow >= this.viewport.endRowTriggerRerender) {
            this.viewport.startRow += halfHeight;
            this.viewport.startRowTriggerRerender += halfHeight;
            this.viewport.endRow += halfHeight;
            this.viewport.endRowTriggerRerender += halfHeight;
            // console.log(halfHeight, this.viewport);

            // Trigger render of the top
            RenderSubscription.notify({
                startRow: this.viewport.endRowTriggerRerender,
                startCol: 0,
                endRow: this.viewport.endRow,
                endCol: 0
            });
        }
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

    public convertToCanvasPos(pos: Vec2): Vec2 {
        const row = pos.y % this.layout.sizes.rows;
        return {x: pos.x * this.layout.sizes.charWidth, y: row * (this.layout.sizes.height + config.fontPadding * 2)};
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
        y = Math.min(this.layout.sizes.rows - 1, Math.floor(y / (this.layout.sizes.height + config.fontPadding * 2))) + (page * this.layout.sizes.rows)

        return {x, y};
    }
}