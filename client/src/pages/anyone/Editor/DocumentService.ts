import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";
import {DocumentSizes, Vec2} from "./utils/interfaces";
import {CursorOperation} from "./ServiceClasses/CursorOperation";
import {KeyEvents} from "./handler/KeyEvents/KeyEvents";
import CursorUpdateSubscription from "./utils/CursorUpdateSubscription";
import {ClipboardEvents} from "./handler/KeyEvents/ClipboardEvents";
import {CanvasContainer} from "./CanvasContainer";
import {LayoutEngine} from "./ServiceClasses/LayoutEngine";
import {TextController} from "./ServiceClasses/TextController";
import {InputController} from "./ServiceClasses/InputController";
import {PageController} from "./ServiceClasses/PageController";

export class DocumentService implements HasSubscription {
    private renderer: DocumentRenderer;

    private cursorOperation: CursorOperation;
    private keyEvents: KeyEvents;
    private clipboardEvents: ClipboardEvents;

    private pageController: PageController;
    private layout: LayoutEngine
    private textController: TextController;
    private inputController: InputController;

    constructor(canvasContainer: CanvasContainer, renderer: DocumentRenderer, editor: RawEditor, sizes: DocumentSizes) {
        this.renderer = renderer;

        this.layout = new LayoutEngine(editor, sizes);
        this.pageController = new PageController(this, canvasContainer, this.layout);

        this.cursorOperation = new CursorOperation(this, this.layout, editor);
        this.textController = new TextController(this.cursorOperation, this.layout, editor, this.pageController);
        this.inputController = new InputController(this.layout, this.textController, this.cursorOperation);

        this.keyEvents = new KeyEvents(this.inputController, this.textController);
        this.clipboardEvents = new ClipboardEvents(this.textController);

        CursorUpdateSubscription.subscribe(this);
    }

    public onMouseMove(e: MouseEvent) {
        const pos = this.pageController.getPagePosition(e);
        this.cursorOperation.handleOnMouseMove(pos);
    }

    public onMouseUp(e: MouseEvent) {
        const pos = this.pageController.getPagePosition(e);
        this.cursorOperation.handleOnMouseUp(pos);
    }

    public onMouseDown(e: MouseEvent) {
        const pos = this.pageController.getPagePosition(e);
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
            const [start, end] = this.cursorOperation.getCursorPositionsStartAndEnd();

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