import {MouseEvent} from "react";
import {RawEditor} from "@utils/RawEditor";
import {
    config,
    EditorOperationConfig,
    EditorOperationsHandle,
    InsetOperation,
    UpdateOperation,
    Vec2
} from "./interfaces/vec2";
import {DocumentService} from "./DocumentService";
import {DocumentRenderer} from "./DocumentRenderer";

const sampleText: string = "class Solution {\npublic:\n    int maxOperations(string s) {\n        int n = s.length();\n        int ans = 0;\n        int i = n-1;\n        while (i >= 0 && s[i] == '1') {\n            i--;\n        }\n        bool first = true;\n        int ones = 0;\n        while (i >= 0) {\n            if (s[i] == '1') {\n                int add = 0;\n                if (s[i + 1] == '0') add++;\n                while (i >= 0 && s[i] == '1') {\n                    ans+=ones + 1;\n                    i--;\n                }\n                ones += add;\n            }\n            i--;\n        }\n\n        return ans;\n    }\n}";

class EditorOperations {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private editor: RawEditor;

    constructor(config: EditorOperationConfig) {
        const {ctx, canvas, editor, sizes} = config;
        this.ctx = ctx;
        this.canvas = canvas;
        this.editor = editor;
    }

    public clearArea(x = 0, y = 0, width = this.canvas.width, height = this.canvas.height): void {
        this.ctx.clearRect(x, y, width, height);
    }

    public getCursorPositionOnCanvas(pos?: Vec2): Vec2 {
        if (pos === undefined) {
            pos = this.editor.getCursorPosition();
        }

        return {x: pos.x * this.width, y: pos.y * this.height};
    }

    private drawText(text: string, pos: Vec2) {
        // @ts-ignore
        this.ctx.fillText(text, pos.x, pos.y, this.charWidth);
    }

    renderText() {
        this.clearArea();
        let row = 0;
        let col = 0;
        [this.editor.getLeft().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, this.getCursorPositionOnCanvas({x: col, y: row + 1}));
                if (node.val === '\n' || col == this.cols) {
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


class InsertText extends EditorOperations implements EditorOperationsHandle<InsetOperation> {
    constructor(config: EditorOperationConfig) {
        super(config);
    }

    public insertSampleText(text: string) {
        for (let char of sampleText) {
            this.editor.insert(char);
        }
        this.renderText();
    }

    handle(options: InsetOperation): void {
        this.editor.insert(options.char);
        this.renderText();
    }
}

class InsertNewLine extends EditorOperations implements EditorOperationsHandle<InsetOperation> {
    constructor(config: EditorOperationConfig) {
        super(config);
    }

    handle(options: InsetOperation): void {
        this.editor.insertNewLine();
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

class BackSpace extends EditorOperations implements EditorOperationsHandle<UpdateOperation> {
    constructor(config: EditorOperationConfig) {
        super(config);
    }

    handle(options: UpdateOperation): void {
        this.editor.backspace();
        this.renderText();
    }
}

class Editor {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private editor: RawEditor;
    private renderer: DocumentRenderer;
    private service: DocumentService;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        this.editor = new RawEditor();
        this.renderer = new DocumentRenderer(this.ctx, this.canvas, this.editor);
        this.service = new DocumentService(this.renderer, this.editor);
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

    private getCorrectPosition(x: number, y: number): Vec2 {
        const {left, top} = this.canvas.getBoundingClientRect();
        x -= left;
        y -= top;
        x += (x % this.charWidth);
        return {x: Math.floor(x / this.charWidth), y: Math.floor(y / this.lineHeight)};
    }

    private onKeyDown(e: KeyboardEvent) {
        const key = e.key;
        if (e.ctrlKey && key === 's') {
            e.preventDefault();
            console.log("Save command executed!");
            return;
        }

        if (key.length === 1) {
            this.insertText.handle({char: key})
            e.preventDefault();
        }

        const pos = this.editor.getCursorPosition();
        if (key === 'Backspace') {
            this.backspace.handle({pos: {x: 0, y: 0}});
        }
        if (key === 'Enter') {
            this.insertNewLine.handle({char: ''})
        }
        switch (key) {
            case "ArrowLeft":
                this.cursorOperation.onMouseDown({x: pos.x - 1, y: pos.y})
                e.preventDefault();
                break
            case "ArrowUp":
                this.cursorOperation.onMouseDown({x: pos.x, y: pos.y - 1})
                e.preventDefault();
                break
            case "ArrowRight":
                this.cursorOperation.onMouseDown({x: pos.x + 1, y: pos.y})
                e.preventDefault();
                break
            case "ArrowDown":
                this.cursorOperation.onMouseDown({x: pos.x, y: pos.y + 1})
                e.preventDefault();
                break
            default:
                break;
        }
    }

    private onMouseMove(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.onMouseMove(pos);
    }

    private onMouseUp(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.onMouseUp(pos);
    }

    private onMouseDown(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.onMouseDown(pos);
    }
}

export default Editor;