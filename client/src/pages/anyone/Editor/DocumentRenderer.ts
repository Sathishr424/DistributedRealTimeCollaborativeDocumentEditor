import {config, DocumentSizes} from "./interfaces/interfaces";
import {RawEditor} from "./RawEditor";
import {Vec2} from "./interfaces/interfaces";
import CursorUpdateSubscription from "./interfaces/CursorUpdateSubscription";

export class DocumentRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private editor: RawEditor;
    private sizes: DocumentSizes;


    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, editor: RawEditor, sizes: DocumentSizes) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.editor = editor;
        this.sizes = sizes;

        this.ctx.fillStyle = config.color;
        this.ctx.font = `${config.fontSize}px ${config.font}`;
        this.renderText();
    }

    public getCursorPositionOnCanvas(pos: Vec2): Vec2 {
        return {x: pos.x * this.sizes.charWidth, y: pos.y * this.sizes.height};
    }

    public clearArea(x = 0, y = 0, width = this.canvas.width, height = this.canvas.height): void {
        this.ctx.clearRect(x, y, width, height);
    }

    public getTheCanvasPos(pos: Vec2): Vec2 {
        return { x: pos.x * this.sizes.charWidth, y: pos.y * this.sizes.height };
    }

    public clearCursor(pos: Vec2): void {
        let newPos = this.getTheCanvasPos(pos);
        this.clearArea(newPos.x-1, newPos.y, config.cursorWidth + 2, this.sizes.height);
    }

    public renderCursor(pos: Vec2): void {
        let newPos = this.getTheCanvasPos(pos);
        this.ctx.fillRect(newPos.x, newPos.y, config.cursorWidth, this.sizes.height);
    }

    private drawText(text: string, pos: Vec2) {
        this.ctx.fillText(text, pos.x, pos.y + this.sizes.height, this.sizes.charWidth);
    }

    private drawSelectionRow(row: number, colStart: number, colEnd: number) {
        console.log("Drawing selection...", [row, colStart, colEnd]);
        this.ctx.fillStyle = config.selectionColor;
        const start = colStart * this.sizes.charWidth;
        this.ctx.fillRect(start, row * this.sizes.height, (colEnd - colStart + 1) * this.sizes.charWidth, this.sizes.height + Math.floor(this.sizes.charWidth / 2));
        this.ctx.fillStyle = config.color;
    }

    private drawSelection(startRow: number, endRow: number): void {
        this.ctx.fillStyle = config.selectionColor;
        this.ctx.fillRect(0, startRow * this.sizes.height, this.sizes.cols * this.sizes.charWidth, this.sizes.height * (endRow - startRow) + Math.floor(this.sizes.charWidth / 2));
        this.ctx.fillStyle = config.color;
    }

    public renderText() {
        console.log("Rerendering text");
        this.clearArea();
        let row = 0;
        let col = 0;
        [this.editor.getTotalCharsBeforeCursor().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, this.getCursorPositionOnCanvas({x: col, y: row}));
                if (node.val === '\n' || col + 1 == this.sizes.cols) {
                    row++;
                    col = 0;
                } else {
                    col++;
                }
                node = node.next;
            }
        })
    }

    public renderTextWithSelection(start: number, end: number) {
        console.log("Rerendering text with selection:", start, end);

        this.clearArea();
        let row = 0;
        let col = 0;
        let cursorPos: Vec2 = {x: -1, y: -1};
        let prevCol = 0;
        let isSelection = false;
        [this.editor.getTotalCharsBeforeCursor().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                cursorPos = this.getCursorPositionOnCanvas({x: col, y: row});
                this.drawText(node.val, cursorPos);

                const pos = row * this.sizes.cols + col;
                if (pos >= start && pos <= end) {
                    if (!isSelection) {
                        isSelection = true;
                        prevCol = col;
                    }
                } else {
                    if (isSelection) {
                        isSelection = false;
                        this.drawSelectionRow(row, prevCol, Math.max(0, col - 1));
                        prevCol = col;
                    }
                }

                if (node.val === '\n' || col + 1 == this.sizes.cols) {
                    if (isSelection) {
                        this.drawSelectionRow(row, prevCol, Math.max(0, col - 1));
                        prevCol = 0;
                    }
                    row++;
                    col = 0;
                } else {
                    col++;
                }
                node = node.next;
            }
        })

        if (isSelection) {
            this.drawSelectionRow(row, prevCol, Math.max(0, col - 1));
        }
    }
}