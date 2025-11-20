import {config, DocumentSizes, RenderViewport} from "./utils/interfaces";
import {RawEditor} from "./RawEditor";
import {Vec2} from "./utils/interfaces";
import {CanvasContainer} from "./CanvasContainer";
import {PageController} from "./ServiceClasses/PageController";
import {LayoutEngine} from "./ServiceClasses/LayoutEngine";
import {Deque} from "@utils/Deque";
import {CursorOperation} from "./ServiceClasses/CursorOperation";
import {HasRenderSubscription} from "./utils/HasRenderSubscription";
import RenderSubscription from "./utils/RenderSubscription";

interface SelectionPos {
    row: number;
    colStart: number;
    colEnd: number;
}

export class DocumentRenderer implements HasRenderSubscription {
    private editor: RawEditor;
    private layout: LayoutEngine;
    private pageController: PageController;

    // For cursor render
    private cursorOperation: CursorOperation;
    private cursorInterval: any;
    private cursorToggle: boolean = true;

    private readonly padding;

    constructor(editor: RawEditor, layout: LayoutEngine, pageController: PageController, cursorOperation: CursorOperation) {
        this.editor = editor;
        this.layout = layout;
        this.pageController = pageController;
        this.cursorOperation = cursorOperation;
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 300);
        this.padding = Math.floor(this.layout.sizes.height * (config.selectionHorizontalPadding / 100));
        RenderSubscription.subscribe(this);
    }

    notify(viewport: RenderViewport): void {
        // console.log(viewport);
        viewport.startRow = Math.max(0, viewport.startRow);
        viewport.endRow = Math.min(this.editor.getTotalRows(), viewport.endRow);
        this.renderViewport(viewport);
    }

    private renderViewport(viewport: RenderViewport): void {
        const [start, end] = this.cursorOperation.getCursorPositionsStartAndEnd();
        // console.log("SELECTION:", [start, end]);
        const startPos = this.layout.convertTo1DPosition({x: 0, y: viewport.startRow})
        const endPos = this.layout.convertTo1DPosition({x: this.layout.sizes.cols, y: viewport.endRow});

        const isTextSelectionEnabled = this.cursorOperation.getIsTextSelection();
        const pos = this.layout.getPosFrom1DIndex(startPos);
        console.log(viewport, [startPos, endPos], pos, this.layout.getPosFrom1DIndex(endPos))
        // console.log(pos, [startPos, endPos], 'convert');
        // return;
        let row = pos.y;
        let col = pos.x;
        let onSelection = false;
        if (isTextSelectionEnabled) {
            if (start.y == end.y) {
                if (row >= start.y && col >= start.x && col <= end.x) {
                    onSelection = true;
                }
            } else {
                if (row >= start.y && col >= start.x) {
                    onSelection = true;
                }
            }
        }
        // console.log(onSelection);

        let selectionRender: SelectionPos[] = [];
        for (let i=startPos; i<endPos; i++) {
            if (col == 0) this.clearRow(row);
            const char = this.editor.getCharAtIndex(i);

            this.drawText(char, {x: col, y: row});

            if (isTextSelectionEnabled) {
                if (row == start.y && col == start.x) onSelection = true;
                if (onSelection && row == end.y && col == end.x) {
                    if (col > 0) selectionRender.push({colStart: row == end.y ? (start.y == end.y ? start.x : 0) : 0, row: row, colEnd: col - 1});
                    onSelection = false;
                }
            }

            if (char === '\n' || col + 1 == this.layout.sizes.cols) {
                if (isTextSelectionEnabled && onSelection) {
                    selectionRender.push({colStart: row == start.y ? start.x : 0, row: row, colEnd: col});
                    onSelection = row < end.y;
                }
                row++;
                col = 0;
            } else {
                col++;
            }
        }

        if (isTextSelectionEnabled && onSelection) {
            selectionRender.push({colStart: row == end.y ? (start.y == end.y ? start.x : 0) : 0, row: row, colEnd: col - 1});
        }
        // console.log(selectionRender);
        for (let sel of selectionRender) {
            this.drawSelectionRow(sel);
        }
    }

    public clearAllPage(): void {
        for (let i = 0; i < this.pageController.getTotalPages(); i++) {
            const ctx = this.pageController.getPageCtx(i)!;
            ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
        }
    }

    private clearRow(row: number): void {
        const ctx = this.pageController.getPageCtxForRow(row);
        const updatedPos = this.pageController.convertToCanvasPos({x: 0, y: row});
        ctx.clearRect(updatedPos.x, updatedPos.y - this.padding, this.layout.sizes.cols * this.layout.sizes.charWidth, this.layout.sizes.height + this.padding * 2);
    }

    private drawText(text: string, pos: Vec2) {
        if (text === '\n') return;
        const updatedPos = this.pageController.convertToCanvasPos(pos);
        const ctx = this.pageController.getPageCtxForRow(pos.y);
        ctx.fillText(text, updatedPos.x, updatedPos.y + this.layout.sizes.height, this.layout.sizes.charWidth);
    }

    private drawSelectionRow(selectionPos: SelectionPos) {
        const ctx = this.pageController.getPageCtxForRow(selectionPos.row);
        const startPos = this.pageController.convertToCanvasPos({x: selectionPos.colStart, y: selectionPos.row});
        const endPos = this.pageController.convertToCanvasPos({x: selectionPos.colEnd + 1, y: selectionPos.row});

        ctx.fillStyle = config.selectionColor;

        ctx.fillRect(startPos.x, startPos.y + this.padding, endPos.x - startPos.x, config.lineHeight);

        ctx.fillStyle = config.color;
    }

    public renderText() {
        const [start, end] = this.cursorOperation.getCursorPositionsStartAndEnd();
        let row = 0;
        let col = 0;
        let onSelection = false;

        let selectionRender: SelectionPos[] = [];
        for (let i=0; i<this.editor.getTotalCharsLength(); i++) {
            if (col == 0) this.clearRow(row);
            const char = this.editor.getCharAtIndex(i);

            this.drawText(char, {x: col, y: row});

            if (this.cursorOperation.getIsTextSelection()) {
                if (row == start.y && col == start.x) onSelection = true;
                if (row == end.y && col == end.x) {
                    if (col > 0) selectionRender.push({colStart: row == end.y ? (start.y == end.y ? start.x : 0) : 0, row: row, colEnd: col - 1});
                    onSelection = false;
                }
            }

            if (char === '\n' || col + 1 == this.layout.sizes.cols) {
                if (this.cursorOperation.getIsTextSelection() && onSelection) {
                    selectionRender.push({colStart: row == start.y ? start.x : 0, row: row, colEnd: col});
                    onSelection = row < end.y;
                }
                row++;
                col = 0;
            } else {
                col++;
            }
        }

        if (this.cursorOperation.getIsTextSelection() && onSelection) {
            selectionRender.push({colStart: row == end.y ? (start.y == end.y ? start.x : 0) : 0, row: row, colEnd: col - 1});
        }
        for (let sel of selectionRender) {
            this.drawSelectionRow(sel);
        }
    }

    public clearCursor(pos: Vec2): void {
        const newPos = this.pageController.convertToCanvasPos(pos);
        const ctx = this.pageController.getPageCtxForRow(pos.y)!;
        ctx.clearRect(newPos.x, newPos.y, config.cursorWidth, this.layout.sizes.height);
    }

    public drawCursor(pos: Vec2): void {
        const newPos = this.pageController.convertToCanvasPos(pos);
        const ctx = this.pageController.getPageCtxForRow(pos.y)!;
        ctx.fillRect(newPos.x, newPos.y, config.cursorWidth, this.layout.sizes.height);
    }

    private renderCursor() {
        if (this.cursorToggle) {
            if (!this.cursorOperation.isMousePressed()) this.drawCursor(this.cursorOperation.getCursorPosition());
        } else {
            if (Date.now() - this.cursorOperation.getLastTimeCursorOnUse() <= 1000) {
                this.cursorToggle = true;
                return;
            }
            this.clearCursor(this.cursorOperation.getCursorPosition());
        }
        this.cursorToggle = !this.cursorToggle;
    }

    public dispose() {
        clearInterval(this.cursorInterval);
    }
}