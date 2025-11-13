import {MouseEvent} from "react";
import {DefaultEditorConfig} from "../../../interfaces/DefaultEditorConfig";
import {RawEditor} from "@utils/RawEditor";

const config: DefaultEditorConfig = {
    font: "monospace",
    fontSize: 16,
    color: "black"
}

interface POS {
    x: number,
    y: number
}

interface InsetOperation {
    char: string,
}

interface UpdateOperation {
    pos: number
}

interface EditorOperationsHandle<T> {
    handle(options: T): void;
}

interface EditorOperationConfig {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    editor: RawEditor;
    cols: number;
    width: number
    height: number;
}

class EditorOperations {
    private _ctx: CanvasRenderingContext2D;
    private _canvas: HTMLCanvasElement;
    private _editor: RawEditor;
    private _cols: number;
    private _width: number
    private _height: number;

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }

    set ctx(value: CanvasRenderingContext2D) {
        this._ctx = value;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    set canvas(value: HTMLCanvasElement) {
        this._canvas = value;
    }

    get editor(): RawEditor {
        return this._editor;
    }

    set editor(value: RawEditor) {
        this._editor = value;
    }

    get cols(): number {
        return this._cols;
    }

    set cols(value: number) {
        this._cols = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    constructor(config: EditorOperationConfig) {
        const { ctx, canvas, editor, cols, width, height } = config;
        this._ctx = ctx;
        this._canvas = canvas;
        this._editor = editor;
        this._cols = cols;
        this._width = width;
        this._height = height;
    }

    public clearArea(x=0, y=0, width=this._canvas.width, height=this._canvas.height): void {
        this._ctx.clearRect(x, y, width, height);
    }

    public getCursorPositionOnCanvas(pos?: number): POS {
        if (pos === undefined) {
            pos = this._editor.getCursorPosition();
        }

        let x = pos % this._cols * this._width;
        let y = Math.floor(pos / this._cols);

        return { x: x - (x % this._width), y: y * this._height + this._height };
    }

    private drawText(text: string, pos: POS) {
        // @ts-ignore
        this.ctx.fillText(text, pos.x, pos.y, this.charWidth);
    }

    renderText() {
        this.clearArea();
        let i=0;
        [this.editor.getLeft().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, this.getCursorPositionOnCanvas(i));
                node = node.next;
                i++;
            }
        })
    }
}

class CursorOperation extends EditorOperations implements EditorOperationsHandle<UpdateOperation> {
    private cursorInterval: any;
    private cursorToggle: boolean = false;
    constructor(config: EditorOperationConfig) {
        super(config);
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 250);
    }

    private clearCursor() {
        if (this.ctx) {
            const pos = this.getCursorPositionOnCanvas();
            this.clearArea(pos.x, pos.y, 2, this.height);
        }
    }

    private showCursor() {
        if (this.ctx) {
            const pos = this.getCursorPositionOnCanvas();
            this.ctx.fillRect(pos.x, pos.y - this.height, 2, this.height);
        }
    }

    private renderCursor() {
        if (!this.cursorToggle) {
            this.showCursor();
        } else {
            this.clearCursor();
        }
        this.cursorToggle = !this.cursorToggle;
    }

    handle(options: UpdateOperation): void {
        this.editor.moveCursor(options.pos);
    }
}

class InsertText extends EditorOperations implements EditorOperationsHandle<InsetOperation> {
    constructor(config: EditorOperationConfig) {
        super(config);
    }

    handle(options: InsetOperation): void {
        this.editor.insert(options.char);
        this.renderText();
    }
}

class DeleteText extends EditorOperations implements EditorOperationsHandle<UpdateOperation> {
    constructor(config: EditorOperationConfig) {
        super(config);
    }

    handle(options: UpdateOperation): void {
        this.editor.delete(options.pos);
        this.renderText();
    }
}

class Editor {
    private canvas: HTMLCanvasElement;
    private editor: RawEditor;
    private ctx: CanvasRenderingContext2D;

    private charWidth: number = 20;
    private lineHeight: number = 20;
    private cols: number = 0;
    private insertText: InsertText;
    private cursorOperation: CursorOperation;
    private deleteText: DeleteText;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
        this.editor = new RawEditor();

        this.ctx.fillStyle = config.color;
        this.ctx.font = `${config.fontSize}px ${config.font}`;
        this.charWidth = this.ctx.measureText("a").width;
        const { width } = this.canvas.getBoundingClientRect();
        this.cols = (width - this.charWidth) / this.charWidth;

        let opConfig: EditorOperationConfig = {
            ctx: this.ctx,
            canvas: this.canvas,
            editor: this.editor,
            cols: this.cols,
            width: this.charWidth,
            height: this.lineHeight
        }

        this.insertText = new InsertText(opConfig);
        this.deleteText = new DeleteText(opConfig);
        this.cursorOperation = new CursorOperation(opConfig);

    }

    public attachEvents() {
        // @ts-ignore
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        // @ts-ignore
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this))
        // @ts-ignore
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    private calcRealPosition(x: number, y: number) {
        const {left, top} = this.canvas.getBoundingClientRect();
    }

    private onKeyDown(e: KeyboardEvent) {
        const key = e.key;
        if (e.ctrlKey && key === 's') {
            e.preventDefault();
            console.log("Save command executed!");
            return;
        }

        if (key.length === 1) {
            this.insertText.handle({ char: key })
        }

        if (key === 'Backspace') {
            this.deleteText.handle({ pos: this.editor.getCursorPosition() - 1 });
        }
    }

    private onMouseMove(e: MouseEvent) {
        this.calcRealPosition(e.clientX, e.clientY);
    }

    private onMouseUp(e: MouseEvent) {
        console.log("MouseUp: ", e);
        // this.mousePressed = false;
    }

    private onMouseDown(e: MouseEvent) {
        this.calcRealPosition(e.clientX, e.clientY);
        console.log("MouseDown: ", e);
        // this.mousePressed = true;
    }
}

export default Editor;