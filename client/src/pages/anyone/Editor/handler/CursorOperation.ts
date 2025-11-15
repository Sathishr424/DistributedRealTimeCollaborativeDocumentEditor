import {Vec2, EditorOperation, config} from "../interfaces/interfaces";
import CursorUpdateSubscription from "../interfaces/CursorUpdateSubscription";
import {DocumentService} from "../DocumentService";
import {Deque} from "@utils/Deque";

export class CursorOperation extends EditorOperation implements HasSubscription {
    private cursorInterval: any;
    private cursorToggle: boolean = false;
    private cursorPosition: Vec2;
    private prevCursorPosition: Vec2 = {x: -1, y: -1};
    private isTextSelected = false;
    private isMouseDown = false;
    private prevCursorPositionForRerender: Vec2 = {x: -1, y: -1};
    private clickIntervals: Deque<number>;

    public getIsTextSelection(): boolean {
        return this.isTextSelected;
    }

    public enableTextSelection(): void {
        this.isTextSelected = true;
    }

    public getPrevCursorPosition(): Vec2 {
        return this.prevCursorPosition;
    }

    public getCursorPosition(): Vec2 {
        return this.cursorPosition;
    }

    constructor(service: DocumentService) {
        super(service);
        this.clickIntervals = new Deque<number>();
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 300);
        this.cursorPosition = service.getCursorPosition();
        CursorUpdateSubscription.subscribe(this);
    }

    public updateCursorPosition(pos: Vec2) {
        this.service.clearCursor(this.cursorPosition);
        this.cursorPosition = pos;
    }

    notify(usage: string): void {
        if (usage === "CURSOR UPDATE") {
            this.service.clearCursor(this.cursorPosition);
            this.cursorPosition = this.service.getCursorPosition();
            if (this.isTextSelected) {
                this.isTextSelected = false;
                CursorUpdateSubscription.notifyForTextUpdate();
            }
        }else if (usage === "KEY EVENT TEXT SELECTION") {
            if (!this.isTextSelected) {
                this.prevCursorPosition = this.cursorPosition;
                this.isTextSelected = true;
            }
            this.cursorPosition = this.service.getCursorPosition();
            if (!(this.cursorPosition.x === this.prevCursorPositionForRerender.x && this.cursorPosition.y === this.prevCursorPositionForRerender.y)) {
                // console.log("Selection:", this.prevCursorPositionForRerender, this.prevCursorPosition, this.cursorPosition, this.isTextSelected);
                CursorUpdateSubscription.notifyForTextUpdate();
            }
            this.prevCursorPositionForRerender = this.cursorPosition;
        }
    }

    private renderCursor() {
        if (!this.cursorToggle) {
            if (!this.isMouseDown) this.service.drawCursor(this.cursorPosition);
        } else {
            this.service.clearCursor(this.cursorPosition);
        }
        this.cursorToggle = !this.cursorToggle;
    }

    public processMoveCursor(mousePos: Vec2) {
        this.service.clearCursor(this.cursorPosition);
        this.service.moveCursor(mousePos);
    }

    public handleOnMouseDown(mousePos: Vec2) {
        this.processMoveCursor(mousePos);
        this.cursorPosition = this.service.getCursorPosition();
        this.prevCursorPosition = this.cursorPosition;
        this.isMouseDown = true;
        if (this.isTextSelected) {
            this.isTextSelected = false;
            CursorUpdateSubscription.notifyForTextAndCursorUpdate();
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

    public setPrevCursorPosition(mousePos: Vec2) {
        this.prevCursorPosition = mousePos;
    }

    public handleOnMouseUp(mousePos: Vec2) {
        this.isMouseDown = false;
    }

    public handleOnMouseMove(mousePos: Vec2) {
        if (this.isMouseDown) {
            this.processMoveCursor(mousePos);
            this.cursorPosition = this.service.getCursorPosition();
            if (!this.isTextSelected && Math.abs(this.cursorPosition.x - this.prevCursorPosition.x) + Math.abs(this.cursorPosition.y - this.prevCursorPosition.y) > 0) {
                this.isTextSelected = true;
            }
            if (this.isTextSelected && !(this.cursorPosition.x === this.prevCursorPositionForRerender.x && this.cursorPosition.y === this.prevCursorPositionForRerender.y)) {
                // console.log("Selection:", this.prevCursorPositionForRerender, this.prevCursorPosition, this.cursorPosition, this.isTextSelected);
                CursorUpdateSubscription.notifyForTextUpdate();
            }
            this.prevCursorPositionForRerender = this.cursorPosition;
        }
        while (this.clickIntervals.back()) {
            this.clickIntervals.popBack();
        }
    }

    public dispose(): void {
        clearInterval(this.cursorInterval);
        this.service.clearCursor(this.cursorPosition);
    }
}