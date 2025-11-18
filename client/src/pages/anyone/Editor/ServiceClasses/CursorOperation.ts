import {config, Vec2} from "../utils/interfaces";
import CursorUpdateSubscription from "../utils/CursorUpdateSubscription";
import {DocumentService} from "../DocumentService";
import {Deque} from "@utils/Deque";
import {LayoutEngine} from "./LayoutEngine";
import {RawEditor} from "../RawEditor";

export class CursorOperation implements HasSubscription {
    private service: DocumentService;
    private layout: LayoutEngine;
    private editor: RawEditor;

    private cursorInterval: any;
    private cursorToggle: boolean = true;
    private mousePosStack: Deque<Vec2>;

    private isTextSelected = false;
    private isMouseDown = false;

    private clickIntervals: Deque<number>;
    private cursorOnUse = Date.now();

    constructor(service: DocumentService, layout: LayoutEngine, editor: RawEditor) {
        this.service = service;
        this.layout = layout;
        this.editor = editor;

        this.mousePosStack = new Deque<Vec2>();
        this.clickIntervals = new Deque<number>();
        this.ready();
        CursorUpdateSubscription.subscribe(this);
    }

    public getIsTextSelection(): boolean {
        return this.isTextSelected;
    }

    public enableTextSelection(): void {
        this.isTextSelected = true;
    }

    public disableTextSelection(): void {
        this.isTextSelected = false;
    }

    public getCursorPositionsStartAndEnd(): Vec2[] {
        let start = this.getPrevCursorPosition();
        let end = this.layout.calculateCursorPosition();
        if (start.y > end.y || (start.y == end.y && start.x > end.x)) {
            [start, end] = [end, start];
        }

        return [start, end];
    }

    public setCursorWithinARange(left: Vec2, right: Vec2) {
        while (!this.mousePosStack.isEmpty()) {
            this.mousePosStack.popBack();
        }
        this.mousePosStack.pushBack(left);
        this.mousePosStack.pushBack(right);
    }

    public getPrevCursorPosition(): Vec2 {
        const tail = this.mousePosStack.getTail()!;
        if (tail && tail.prev) {
            return tail.prev.val;
        }
        return tail.val;
    }

    public getCursorPosition(): Vec2 {
        return this.mousePosStack.back()!;
    }

    public ready(): void {
        this.mousePosStack.pushBack(this.layout.calculateCursorPosition());
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 300);
    }

    public updateLiveCursorPosition() {
        this.updateCursorPosition(this.layout.calculateCursorPosition(), false);
    }

    public isTwoCursorPosDifferent(a: Vec2, b: Vec2): boolean {
        return !(a.x == b.x && a.y == b.y);
    }

    public updateCursorPosition(pos: Vec2, clear=true) {
        const prev = this.getCursorPosition();
        if (this.isTwoCursorPosDifferent(prev, pos)) {
            if (clear) this.service.clearCursor(prev);
            if (this.isTextSelected) {
                this.mousePosStack.getTail()!.val = pos;
            } else {
                this.mousePosStack.pushBack(pos);
            }

            while (this.mousePosStack.size() > 2) {
                this.mousePosStack.popFront();
            }
        }
    }

    notify(usage: string): void {
        if (usage === "CURSOR UPDATE") {
            this.updateCursorPosition(this.layout.calculateCursorPosition())
            if (this.isTextSelected) {
                this.disableTextSelection()
                CursorUpdateSubscription.notifyForTextUpdate();
            }
            this.cursorOnUse = Date.now();
            this.cursorToggle = true;
        } else if (usage === "KEY EVENT TEXT SELECTION") {
            const prev = this.getCursorPosition();
            this.updateCursorPosition(this.layout.calculateCursorPosition());
            if (!this.isTextSelected) {
                this.enableTextSelection()
            }
            if (this.isTwoCursorPosDifferent(prev, this.getCursorPosition())) {
                CursorUpdateSubscription.notifyForTextUpdate();
            }
        }
    }

    private renderCursor() {
        if (this.cursorToggle) {
            if (!this.isMouseDown) this.service.drawCursor(this.getCursorPosition());
        } else {
            if (Date.now() - this.cursorOnUse <= 1000) return;
            this.service.clearCursor(this.getCursorPosition());
        }
        this.cursorToggle = !this.cursorToggle;
    }

    public processMoveCursor(mousePos: Vec2) {
        this.service.clearCursor(this.getCursorPosition());
        this.moveCursor(mousePos);
    }

    public handleOnMouseDown(mousePos: Vec2) {
        this.processMoveCursor(mousePos);
        this.isMouseDown = true;
        const newPos = this.layout.calculateCursorPosition();
        this.updateCursorPosition(newPos);
        if (this.service.isCombinationKeyEnabled('shift')) {
            this.enableTextSelection()
            CursorUpdateSubscription.notifyForTextUpdate();
        } else {
            if (this.isTextSelected) {
                this.disableTextSelection();
                CursorUpdateSubscription.notifyForTextAndCursorUpdate();
            }
        }

        while (this.clickIntervals.size() && Date.now() - (this.clickIntervals.front() || 0) > config.mouseInterval) {
            this.clickIntervals.popBack();
        }
        this.clickIntervals.pushBack(Date.now());
        if (this.clickIntervals.size() === 3) {
            let left = this.clickIntervals.front() || 0;
            let right = this.clickIntervals.back() || 0;
            if (right - left <= config.mouseInterval) {
                this.service.selectEntireLine();
            }
        } else if (this.clickIntervals.size() === 2) {
            let left = this.clickIntervals.front() || 0;
            let right = this.clickIntervals.back() || 0;
            if (right - left <= config.mouseInterval) {
                this.service.selectCurrentWord();
            }
        }
    }

    public handleOnMouseUp(mousePos: Vec2) {
        this.isMouseDown = false;
    }

    public handleOnMouseMove(mousePos: Vec2) {
        if (this.isMouseDown) {
            // If left mouse is in pressed state, we check if current and previous recorded mouse position is different and proceed
            if (this.isTwoCursorPosDifferent(this.getCursorPosition(), mousePos)) {
                this.processMoveCursor(mousePos);
                this.updateCursorPosition(this.layout.calculateCursorPosition());

                if (!this.isTextSelected) {
                    this.enableTextSelection();
                }
                if (this.isTextSelected) {
                    CursorUpdateSubscription.notifyForTextUpdate();
                }
            }
        }
        while (this.clickIntervals.back()) {
            this.clickIntervals.popBack();
        }
    }

    public moveToPosition(pos: number) {
        let diff = this.editor.getCursorPosition() - pos;

        if (diff > 0) {
            this.editor.moveLeft(diff);
        } else {
            this.editor.moveRight(diff * -1);
        }
    }

    public moveCursorToEnd() {
        const pos = this.layout.getLastCharPosition();
        this.moveCursor(pos);
    }

    public moveCursor(newPos: Vec2) {
        let realPos = this.layout.convertTo1DPosition(newPos);
        let diff = this.editor.getTotalCharsBeforeCursor().size() - realPos;

        if (diff > 0) {
            this.editor.moveLeft(diff);
        } else {
            this.editor.moveRight(diff * -1);
        }
    }

    public moveCursorLeft() {
        this.editor.moveLeft(1);
    }

    public moveCursorRight() {
        this.editor.moveRight(1);
    }

    public moveCursorUp() {
        const pos = this.layout.calculateCursorPosition();
        this.moveCursor({ x: pos.x, y: pos.y - 1 });
    }

    public moveCursorDown() {
        const pos = this.layout.calculateCursorPosition();
        this.moveCursor({ x: pos.x, y: pos.y + 1 });
    }

    public dispose(): void {
        clearInterval(this.cursorInterval);
        this.service.clearCursor(this.getCursorPosition());
    }
}