import {Vec2, EditorOperation} from "../interfaces/interfaces";
import {RawEditor} from "../RawEditor";
import {DocumentRenderer} from "../DocumentRenderer";

export class CursorOperation extends EditorOperation {
    private cursorInterval: any;
    private cursorToggle: boolean = false;

    constructor(editor: RawEditor, renderer: DocumentRenderer) {
        super(editor, renderer);
        this.cursorInterval = setInterval(this.renderCursor.bind(this), 300);
    }

    private renderCursor() {
        if (!this.cursorToggle) {
            this.renderer.showCursor();
        } else {
            this.renderer.clearCursor();
        }
        this.cursorToggle = !this.cursorToggle;
    }

    public handleOnMouseDown(mousePos: Vec2) {
        this.renderer.clearCursor();
        this.editor.moveCursor(mousePos);
    }

    public handleOnMouseUp(mousePos: Vec2) {
    }

    public handleOnMouseMove(mousePos: Vec2) {
    }
}