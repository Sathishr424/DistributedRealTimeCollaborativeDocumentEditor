import {config, DocumentSizes} from "./interfaces/interfaces";
import {RawEditor} from "./RawEditor";
import {Vec2} from "./interfaces/interfaces";
import {CanvasContainer} from "./CanvasContainer";

export class DocumentRenderer {
    private canvasContainer: CanvasContainer;
    private editor: RawEditor;
    private sizes: DocumentSizes;


    constructor(canvasContainer: CanvasContainer, editor: RawEditor, sizes: DocumentSizes) {
        this.canvasContainer = canvasContainer;
        this.editor = editor;
        this.sizes = sizes;

        this.renderText();
    }

    public getCtx(pos: Vec2): CanvasRenderingContext2D {
        let page = Math.floor(pos.y / this.sizes.rows);
        let canvas = this.canvasContainer.getCanvas(page);
        // console.log(pos, this.canvasContainer.getCanvasesTotal(), page, canvas);
        // @ts-ignore
        return canvas.getContext("2d");
    }

    public clearAllPage(): void {
        for (let i = 1; i < this.canvasContainer.getCanvasesTotal(); i++) {
            // @ts-ignore
            const ctx = this.canvasContainer.getCanvas(i).getContext('2d');
            // @ts-ignore
            ctx.clearRect(0, 0, this.sizes.rows * this.sizes.height, this.sizes.cols * this.sizes.charWidth);
        }
    }

    public getTheCanvasPos(pos: Vec2): Vec2 {
        const row = Math.floor(pos.y / this.sizes.rows);
        return { x: pos.x * this.sizes.charWidth, y: (pos.y - (row * this.sizes.rows))  * this.sizes.height };
    }

    public clearCursor(pos: Vec2): void {
        let newPos = this.getTheCanvasPos(pos);
        const ctx = this.getCtx(pos);
        ctx.clearRect(newPos.x-1, newPos.y, config.cursorWidth + 2, this.sizes.height);
    }

    public renderCursor(pos: Vec2): void {
        let newPos = this.getTheCanvasPos(pos);
        const ctx = this.getCtx(pos);
        ctx.fillRect(newPos.x, newPos.y, config.cursorWidth, this.sizes.height);
    }

    private drawText(text: string, pos: Vec2) {
        const updatedPos = this.getTheCanvasPos(pos);
        const ctx = this.getCtx(pos);
        ctx.fillText(text, updatedPos.x, updatedPos.y + this.sizes.height, this.sizes.charWidth);
    }

    private drawSelectionRow(row: number, colStart: number, colEnd: number) {
        const ctx = this.getCtx({y: row, x: colStart});
        row = Math.floor(row / this.sizes.rows);

        ctx.fillStyle = config.selectionColor;
        const start = colStart * this.sizes.charWidth;
        ctx.fillRect(start, row * this.sizes.height, (colEnd - colStart + 1) * this.sizes.charWidth, this.sizes.height + Math.floor(this.sizes.charWidth / 2));
        ctx.fillStyle = config.color;
    }

    public renderText() {
        // console.log("Rerendering text");
        this.clearAllPage();
        let row = 0;
        let col = 0;
        [this.editor.getTotalCharsBeforeCursor().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, {x: col, y: row});
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

    public renderTextWithSelection(start: Vec2, end: Vec2) {
        // console.log("Rerendering text with selection:", start, end);

        this.clearAllPage();
        let row = 0;
        let col = 0;
        let onSelection = false;

        [this.editor.getTotalCharsBeforeCursor().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, {x: col, y: row});

                const pos = row * this.sizes.cols + col;
                if (row == start.y && col == start.x) onSelection = true;
                if (row == end.y && col == end.x) {
                    this.drawSelectionRow(row, row == end.y ? (start.y == end.y ? start.x : 0) : 0, col - 1);
                    onSelection = false;
                }

                if (node.val === '\n' || col + 1 == this.sizes.cols) {
                    if (onSelection) {
                        this.drawSelectionRow(row, row == start.y ? start.x : 0, col);
                        onSelection = row + 1 <= end.y;
                    }
                    row++;
                    col = 0;
                } else {
                    col++;
                }
                node = node.next;
            }
        })

        if (onSelection) {
            this.drawSelectionRow(row, row == end.y ? (start.y == end.y ? start.x : 0) : 0, col - 1);
        }
    }

    public getCanvasOffset(page: number): DOMRect {
        return this.canvasContainer.getCanvas(page).getBoundingClientRect();
    }
}