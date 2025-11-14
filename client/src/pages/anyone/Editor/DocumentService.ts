import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";
import {Vec2} from "./interfaces/interfaces";
import {CursorOperation} from "./commands/CursorOperation";
import {ALLKeyEvents} from "./commands/KeyEvents/ALLKeyEvents";

export class DocumentService {
    private renderer: DocumentRenderer;
    private editor: RawEditor
    private cursorOperation: CursorOperation;
    private keyEvents: ALLKeyEvents;

    constructor(renderer: DocumentRenderer, editor: RawEditor) {
        this.renderer = renderer;
        this.editor = editor;

        this.cursorOperation = new CursorOperation(editor, renderer);
        this.keyEvents = new ALLKeyEvents(editor);
    }

    private getCorrectPosition(x: number, y: number): Vec2 {
        x -= this.editor.sizes.left;
        y -= this.editor.sizes.top;
        x += (x % this.editor.sizes.charWidth);
        return {x: Math.floor(x / this.editor.sizes.charWidth), y: Math.floor(y / this.editor.sizes.height)};
    }

    public onMouseMove(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.handleOnMouseMove(pos);
    }

    public onMouseUp(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.handleOnMouseUp(pos);
    }

    public onMouseDown(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.handleOnMouseDown(pos);
    }

    public onKeyDown(e: KeyboardEvent) {
        this.keyEvents.handle(e);
    }
}