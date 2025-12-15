import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./ServiceClasses/DocumentRenderer";
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
import {HasSubscription} from "./utils/HasSubscription";
import SocketClass from "./ServiceClasses/SocketClass";
import {config} from "../../../shared/config";

export class DocumentService implements HasSubscription {
    private cursorOperation: CursorOperation;
    private keyEvents: KeyEvents;
    private clipboardEvents: ClipboardEvents;

    private renderer: DocumentRenderer;
    private pageController: PageController;
    private layout: LayoutEngine;
    private textController: TextController;
    private inputController: InputController;
    private hasWriteAccess: boolean = false;

    constructor(canvasContainer: CanvasContainer, editor: RawEditor, sizes: DocumentSizes, documentKey: string, hasWriteAccess: boolean) {
        this.hasWriteAccess = hasWriteAccess;

        this.layout = new LayoutEngine(editor, sizes);
        this.pageController = new PageController(this, canvasContainer, this.layout);

        this.cursorOperation = new CursorOperation(this, this.layout, editor);

        this.textController = new TextController(this.cursorOperation, this.layout, editor, this.pageController, documentKey);
        this.inputController = new InputController(this.layout, this.textController, this.cursorOperation);

        this.renderer = new DocumentRenderer(editor, this.layout, this.pageController, this.cursorOperation);

        this.keyEvents = new KeyEvents(this.inputController, this.textController);
        this.clipboardEvents = new ClipboardEvents(this.textController, this.inputController);

        CursorUpdateSubscription.subscribe(this);

        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
        this.pageController.initialRender();
    }

    public onScroll(e: Event) {
        this.pageController.onScroll(e);
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
        if (!this.hasWriteAccess) {
            return alert("You have not write access");
        }
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

    public clearCursor(pos: Vec2): void {
        this.renderer.clearCursor(pos);
    }

    notify(usage: string): void {
        if (usage !== "TEXT OPERATION") return;

        // this.renderer.renderText();
        this.pageController.rerenderViewport();
    }

    public dispose() {
        this.renderer.dispose();
        this.textController.dispose();
        // @ts-ignore
        this.renderer = null;
        // @ts-ignore
        this.pageController = null;
        // @ts-ignore
        this.layout = null;
        // @ts-ignore
        this.textController = null;
        // @ts-ignore
        this.inputController = null;
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