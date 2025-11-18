import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";
import {DocumentSizes, Vec2} from "./utils/interfaces";
import {CursorOperation} from "./handler/CursorOperation";
import {KeyEvents} from "./handler/KeyEvents/KeyEvents";
import CursorUpdateSubscription from "./utils/CursorUpdateSubscription";
import {ClipboardEvents} from "./handler/KeyEvents/ClipboardEvents";
import {CanvasContainer} from "./CanvasContainer";
import {CombinationKeyState} from "./utils/CombinationKeyState";
import {LayoutEngine} from "./ServiceClasses/LayoutEngine";
import {TextController} from "./ServiceClasses/TextController";
import {InputController} from "./ServiceClasses/InputController";

export class DocumentService implements HasSubscription {
    private renderer: DocumentRenderer;

    private cursorOperation: CursorOperation;
    private keyEvents: KeyEvents;
    private clipboardEvents: ClipboardEvents;

    private layout: LayoutEngine
    private textController: TextController;
    private inputController: InputController;

    constructor(canvasContainer: CanvasContainer, renderer: DocumentRenderer, editor: RawEditor, sizes: DocumentSizes) {
        this.renderer = renderer;

        this.layout = new LayoutEngine(this, canvasContainer, editor, sizes);

        this.cursorOperation = new CursorOperation(this, this.layout);
        this.textController = new TextController(this.cursorOperation, this.layout, editor);
        this.inputController = new InputController(this.layout, this.textController);

        this.keyEvents = new KeyEvents(this.inputController, this.textController);
        this.clipboardEvents = new ClipboardEvents(this.textController);

        CursorUpdateSubscription.subscribe(this);
    }

    // start --- Events
    public onMouseMove(e: MouseEvent) {
        const pos = this.layout.getCorrectPosition(e);
        this.cursorOperation.handleOnMouseMove(pos);
    }

    public onMouseUp(e: MouseEvent) {
        const pos = this.layout.getCorrectPosition(e);
        this.cursorOperation.handleOnMouseUp(pos);
    }

    public onMouseDown(e: MouseEvent) {
        const pos = this.layout.getCorrectPosition(e);
        this.cursorOperation.handleOnMouseDown(pos);
    }

    public onKeyDown(e: KeyboardEvent) {
        this.keyEvents.handleKeyDown(e);
    }

    public onKeyUp(e: KeyboardEvent) {
        this.keyEvents.handleKeyUp(e);
    }

    public onCopy(e: ClipboardEvent) {
        this.clipboardEvents.executeCopyCommand(e);
    }

    public onCut(e: ClipboardEvent) {
        this.clipboardEvents.executeCutCommand(e);
    }

    public onPaste(e: ClipboardEvent) {
        this.clipboardEvents.executePasteCommand(e);
    }

    public drawCursor(pos: Vec2): void {
        this.renderer.renderCursor(pos);
    }

    public clearCursor(pos: Vec2): void {
        this.renderer.clearCursor(pos);
    }

    notify(usage: string): void {
        if (usage !== "TEXT OPERATION") return;

        if (this.textController.isCursorInTextSelection()) {
            const [start, end] = this.layout.getCursorPositionsStartAndEnd();

            this.renderer.renderTextWithSelection(start, end);
        } else {
            this.renderer.renderText();
        }
    }

    public dispose() {
        this.cursorOperation.dispose();
    }

    public updateLiveCursorPosition() {
        return this.cursorOperation.updateLiveCursorPosition();
    }

    public getPrevCursorPosition() {
        return this.cursorOperation.getPrevCursorPosition();
    }

    public selectEntireLine() {
        this.textController.selectEntireLine();
    }

    public selectCurrentWord() {
        this.textController.selectCurrentWord();
    }

    public isCombinationKeyEnabled(key: string) {
        return this.inputController.isCombinationKeyEnabled(key);
    }
}