import {Vec2, EditorOperation} from "../interfaces/interfaces";
import CursorUpdateSubscription from "../interfaces/CursorUpdateSubscription";
import {DocumentService} from "../DocumentService";

export class CursorOperation extends EditorOperation implements HasSubscription {
    private cursorInterval: any;
    private cursorToggle: boolean = false;
    private cursorPosition: Vec2;
    private prevCursorPosition: Vec2 = {x: -1, y: -1};
    private isTextSelected = false;
    private isMouseDown = false;

    public getIsTextSelected(): boolean {
        return this.isTextSelected;
    }

    public getPrevCursorPosition(): Vec2 {
        return this.prevCursorPosition;
    }

    public getCursorPosition(): Vec2 {
        return this.cursorPosition;
    }

    constructor(service: DocumentService) {
        super(service);
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 300);
        this.cursorPosition = service.getCursorPosition();
        CursorUpdateSubscription.subscribe(this);
    }

    notify(usage: string): void {
        if (usage === "CURSOR UPDATE") {
            this.service.clearCursor(this.cursorPosition);
            this.cursorPosition = this.service.getCursorPosition();
            this.isTextSelected = false;
        } if (usage === "KEY EVENT TEXT SELECTOR") {
            if (!this.isTextSelected) {
                this.prevCursorPosition = this.cursorPosition;
                this.isTextSelected = true;
            }
            this.cursorPosition = this.service.getCursorPosition();
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
            console.log("Selection:", this.prevCursorPosition, this.cursorPosition, this.isTextSelected);
            CursorUpdateSubscription.notifyForTextUpdate();
        }
    }

    public dispose(): void {
        clearInterval(this.cursorInterval);
        this.service.clearCursor(this.cursorPosition);
    }
}