import {config, DocumentSizes} from "./utils/interfaces";
import {RawEditor} from "./RawEditor";
import {Vec2} from "./utils/interfaces";
import {CanvasContainer} from "./CanvasContainer";
import {PageController} from "./ServiceClasses/PageController";
import {LayoutEngine} from "./ServiceClasses/LayoutEngine";
import {Deque} from "@utils/Deque";
import {CursorOperation} from "./ServiceClasses/CursorOperation";

export class DocumentRenderer {
    private editor: RawEditor;
    private layout: LayoutEngine;
    private pageController: PageController;

    // For cursor render
    private cursorOperation: CursorOperation;
    private cursorInterval: any;
    private cursorToggle: boolean = true;

    constructor(editor: RawEditor, layout: LayoutEngine, pageController: PageController, cursorOperation: CursorOperation) {
        this.editor = editor;
        this.layout = layout;
        this.pageController = pageController;
        this.cursorOperation = cursorOperation;
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 300);
    }

    public clearAllPage(): void {
        for (let i = 0; i < this.pageController.getTotalPages(); i++) {
            const ctx = this.pageController.getPageCtx(i)!;
            ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
        }
    }

    private drawText(text: string, pos: Vec2) {
        if (text === '\n') return;
        const updatedPos = this.layout.convertToCanvasPos(pos);
        const ctx = this.pageController.getPageCtxForRow(pos.y);
        ctx.fillText(text, updatedPos.x, updatedPos.y + this.layout.sizes.height, this.layout.sizes.charWidth);
    }

    private drawSelectionRow(row: number, colStart: number, colEnd: number) {
        const ctx = this.pageController.getPageCtxForRow(row);
        row %= this.layout.sizes.rows;

        ctx.fillStyle = config.selectionColor;
        const start = colStart * this.layout.sizes.charWidth;

        const padding = Math.floor(this.layout.sizes.height * (config.selectionHorizontalPadding / 100));

        ctx.fillRect(start, row * config.lineHeight + padding, (colEnd - colStart + 1) * this.layout.sizes.charWidth, config.lineHeight);

        ctx.fillStyle = config.color;
    }

    public renderText() {
        console.log("Rerendering text");
        this.clearAllPage();
        let row = 0;
        let col = 0;
        [this.editor.getTotalCharsBeforeCursor().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, {x: col, y: row});
                if (node.val === '\n' || col + 1 == this.layout.sizes.cols) {
                    if (col + 1 == this.layout.sizes.cols && node.next && node.next.val === '\n') {
                        node = node.next
                    }
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
        this.clearAllPage();
        let row = 0;
        let col = 0;
        let onSelection = false;

        [this.editor.getTotalCharsBeforeCursor().getHead(), this.editor.getRight().getHead()].forEach(node => {
            while (node) {
                this.drawText(node.val, {x: col, y: row});

                const pos = row * this.layout.sizes.cols + col;
                if (row == start.y && col == start.x) onSelection = true;
                if (row == end.y && col == end.x) {
                    this.drawSelectionRow(row, row == end.y ? (start.y == end.y ? start.x : 0) : 0, col - 1);
                    onSelection = false;
                }

                if (node.val === '\n' || col + 1 == this.layout.sizes.cols) {
                    if (onSelection) {
                        this.drawSelectionRow(row, row == start.y ? start.x : 0, col);
                        onSelection = row < end.y;
                    }
                    if (col + 1 == this.layout.sizes.cols && node.next && node.next.val === '\n') {
                        node = node.next
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

    public clearCursor(pos: Vec2): void {
        const newPos = this.layout.convertToCanvasPos(pos);
        const ctx = this.pageController.getPageCtxForRow(pos.y)!;
        ctx.clearRect(newPos.x, newPos.y, config.cursorWidth, this.layout.sizes.height);
    }

    public drawCursor(pos: Vec2): void {
        const newPos = this.layout.convertToCanvasPos(pos);
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