import {config} from "./interfaces/interfaces";
import {RawEditor} from "./RawEditor";
import {Vec2} from "./interfaces/interfaces";

export class DocumentRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private editor: RawEditor;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, editor: RawEditor) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.editor = editor;

        this.ctx.fillStyle = config.color;
        this.ctx.font = `${config.fontSize}px ${config.font}`;
    }

    public getCursorPositionOnCanvas(pos: Vec2): Vec2 {
        return {x: pos.x * this.editor.sizes.charWidth, y: pos.y * this.editor.sizes.height};
    }

    public clearArea(x = 0, y = 0, width = this.canvas.width, height = this.canvas.height): void {
        this.ctx.clearRect(x, y, width, height);
    }

    public clearCursor() {

    }

    public showCursor() {

    }

    private drawText(text: string, pos: Vec2) {
        this.ctx.fillText(text, pos.x, pos.y, this.editor.sizes.charWidth);
    }

    public renderText() {
        this.clearArea();
        let row = 0;
        let col = 0;
        [this.editor.getLeft().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, this.getCursorPositionOnCanvas({x: col, y: row + 1}));
                if (node.val === '\n' || col == this.editor.sizes.cols) {
                    row++;
                    col = 0;
                } else {
                    col++;
                }
                node = node.next;
            }
        })
    }
}