import {Vec2, EditorOperation} from "../interfaces/interfaces";
import {RawEditor} from "../RawEditor";
import {DocumentRenderer} from "../DocumentRenderer";
import CursorUpdateSubscription from "../interfaces/CursorUpdateSubscription";

export class CursorOperation extends EditorOperation implements HasSubscription {
    private cursorInterval: any;
    private cursorToggle: boolean = false;
    private cursorPosition: Vec2;

    constructor(editor: RawEditor, renderer: DocumentRenderer) {
        super(editor, renderer);
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 300);
        this.cursorPosition = editor.getCursorPosition();
        CursorUpdateSubscription.subscribe(this);
    }


    notify(): void {
        this.cursorPosition = this.editor.getCursorPosition();
    }

    private renderCursor() {
        if (!this.cursorToggle) {
            this.renderer.showCursor(this.cursorPosition);
        } else {
            this.renderer.clearCursor(this.cursorPosition);
        }
        this.cursorToggle = !this.cursorToggle;
    }

    public handleOnMouseDown(mousePos: Vec2) {
        this.renderer.clearCursor(this.cursorPosition);
        this.editor.moveCursor(mousePos);
        this.cursorPosition = this.editor.getCursorPosition();
    }

    public handleOnMouseUp(mousePos: Vec2) {
    }

    public handleOnMouseMove(mousePos: Vec2) {
    }
}