import {config, DocumentSizes} from "./interfaces/interfaces";
import {RawEditor} from "@utils/RawEditor";
import {Vec2} from "./interfaces/interfaces";
import {DocumentService} from "./DocumentService";

export class DocumentRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private sizes: DocumentSizes;
    private editor: RawEditor;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, editor: RawEditor) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.editor = editor;

        this.ctx.fillStyle = config.color;
        this.ctx.font = `${config.fontSize}px ${config.font}`;

        const charWidth = this.ctx.measureText("a").width;
        const {width} = this.canvas.getBoundingClientRect();
        this.sizes = {
            width: charWidth,
            height: config.lineHeight,
            cols: Math.floor((width - charWidth) / charWidth)
        }
    }

    public getCursorPositionOnCanvas(pos: Vec2): Vec2 {
        return {x: pos.x * this.sizes.width, y: pos.y * this.sizes.height};
    }

    public clearArea(x = 0, y = 0, width = this.canvas.width, height = this.canvas.height): void {
        this.ctx.clearRect(x, y, width, height);
    }

    public clearCursor() {

    }

    public showCursor() {

    }

    private drawText(text: string, pos: Vec2) {
        // @ts-ignore
        this.ctx.fillText(text, pos.x, pos.y, this.charWidth);
    }

    public renderText() {
        this.clearArea();
        let row = 0;
        let col = 0;
        [this.editor.getLeft().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, this.getCursorPositionOnCanvas({x: col, y: row + 1}));
                if (node.val === '\n' || col == this.sizes.cols) {
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