import {config, DocumentSizes} from "./interfaces/interfaces";
import {RawEditor} from "./RawEditor";
import {Vec2} from "./interfaces/interfaces";
import CursorUpdateSubscription from "./interfaces/CursorUpdateSubscription";

export class DocumentRenderer implements HasSubscription{
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
        CursorUpdateSubscription.subscribe(this);
    }

    notify(): void {
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
        this.ctx.fillText(text, pos.x, pos.y, this.sizes.charWidth);
    }

    public renderText() {
        console.log("Rerendering text");
        this.clearArea();
        let row = 0;
        let col = 0;
        [this.editor.getLeft().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, this.getCursorPositionOnCanvas({x: col, y: row + 1}));
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
}