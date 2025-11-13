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

class Editor {
    private canvas: HTMLCanvasElement;
    private editor: RawEditor;
    private mousePressed: boolean = false;
    private ctx: CanvasRenderingContext2D | null;

    private charWidth: number = 20;
    private lineHeight: number = 20;
    private maxCol: number = 0;

    private cursorInterval: any;
    private cursorToggle: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.editor = new RawEditor();

        if (this.ctx) {
            this.ctx.fillStyle = config.color;
            this.ctx.font = `${config.fontSize}px ${config.font}`;
            this.charWidth = this.ctx.measureText("a").width;
            const { width } = this.canvas.getBoundingClientRect();
            this.maxCol = (width - this.charWidth) / this.charWidth;
            this.cursorInterval = setInterval(this.renderCursor.bind(this), 250);
        }
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
            console.log(`Character to insert: ${key}`);
            this.editor.insert(key);
            this.renderText();
        }

        if (key === 'Backspace') {
            // ... logic to delete character
        }
    }

    private onMouseMove(e: MouseEvent) {
        this.calcRealPosition(e.clientX, e.clientY);
    }

    private onMouseUp(e: MouseEvent) {
        console.log("MouseUp: ", e);
        this.mousePressed = false;
    }

    private onMouseDown(e: MouseEvent) {
        this.calcRealPosition(e.clientX, e.clientY);
        console.log("MouseDown: ", e);
        this.mousePressed = true;
    }

    public renderTexts() {

    }

    private clearAll() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    private getCursorPosition(pos?: number): POS {
        if (pos === undefined) {
            pos = this.editor.getCursorPosition();
        }

        let x = pos % this.maxCol * this.charWidth;
        let y = Math.floor(pos / this.maxCol);

        console.log(pos, x, y);
        return { x: x - (x % this.charWidth), y: y * this.lineHeight + this.lineHeight };
    }

    private clearCursor() {
        if (this.ctx) {
            const pos = this.getCursorPosition();
            this.ctx.clearRect(pos.x, pos.y, 2, this.lineHeight);
        }
    }

    private showCursor() {
        if (this.ctx) {
            const pos = this.getCursorPosition();
            this.ctx.fillRect(pos.x, pos.y - this.lineHeight, 2, this.lineHeight);
        }
    }

    private drawText(text: string, pos: POS) {
        // @ts-ignore
        this.ctx.fillText(text, pos.x, pos.y, this.charWidth);
    }

    private renderText() {
        if (this.ctx) {
            this.clearAll();
            let left = this.editor.getLeft();
            let right = this.editor.getRight();

            let i=0;
            let node = left.getHead();
            while (node) {
                this.drawText(node.val, this.getCursorPosition(i));
                node = node.next;
                i++;
            }

            node = right.getHead();
            while (node) {
                this.drawText(node.val, this.getCursorPosition(i));
                node = node.next;
                i++;
            }
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
}

export default Editor;