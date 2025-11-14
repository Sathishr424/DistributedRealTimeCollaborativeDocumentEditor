import {Vec2, EditorOperation} from "../interfaces/interfaces";
import CursorUpdateSubscription from "../interfaces/CursorUpdateSubscription";
import {DocumentService} from "../DocumentService";

export class CursorOperation extends EditorOperation implements HasSubscription {
    private cursorInterval: any;
    private cursorToggle: boolean = false;
    private cursorPosition: Vec2;

    constructor(service: DocumentService) {
        super(service);
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 300);
        this.cursorPosition = service.getCursorPosition();
        CursorUpdateSubscription.subscribe(this);
    }

    notify(): void {
        this.cursorPosition = this.service.getCursorPosition();
    }

    private renderCursor() {
        if (!this.cursorToggle) {
            this.service.drawCursor(this.cursorPosition);
        } else {
            this.service.clearCursor(this.cursorPosition);
        }
        this.cursorToggle = !this.cursorToggle;
    }

    public handleOnMouseDown(mousePos: Vec2) {
        this.service.clearCursor(this.cursorPosition);
        this.service.moveCursor(mousePos);
        this.cursorPosition = this.service.getCursorPosition();
    }

    public handleOnMouseUp(mousePos: Vec2) {
    }

    public handleOnMouseMove(mousePos: Vec2) {
    }

    public dispose(): void {
        clearInterval(this.cursorInterval);
        this.service.clearCursor(this.cursorPosition);
    }
}