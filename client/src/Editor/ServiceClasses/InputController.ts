import CursorUpdateSubscription from "../utils/CursorUpdateSubscription";
import {CommandMap, config} from "../utils/interfaces";
import {LayoutEngine} from "./LayoutEngine";
import {TextController} from "./TextController";
import {initializeCommands} from "../CommandRegistry";
import {CombinationKeyState} from "../utils/CombinationKeyState";
import {CursorOperation} from "./CursorOperation";

export class InputController {
    private layout: LayoutEngine;
    private textController: TextController;
    private cursorOperation: CursorOperation;
    private readonly commands: CommandMap;
    private combinationKeyState: CombinationKeyState;

    constructor(layout: LayoutEngine, textController: TextController, cursorOperation: CursorOperation) {
        this.layout = layout;
        this.textController = textController;
        this.cursorOperation = cursorOperation;
        this.combinationKeyState = new CombinationKeyState();

        this.commands = initializeCommands(this, this.layout, this.textController, this.cursorOperation);
    }

    public handleBackSpace() {
        if (!this.textController.deleteTextSelection()) {
            this.textController.backspace();
        }
        this.textController.checkPages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleDeleteKey() {
        if (!this.textController.deleteTextSelection()) {
            this.textController.deleteKey();
        }
        this.textController.checkPages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleInsertChar(char: string) {
        const change = this.textController.deleteTextSelection()
        this.textController.insertChar(char, change);
    }

    public handleInsertTab() {
        this.textController.deleteTextSelection()
        this.textController.insertText(new Array(config.tabSize).fill(' ').join(''));
    }

    public handleInsertNewLine() {
        const change = this.textController.deleteTextSelection()
        this.textController.insertChar('\n', change);
    }

    public handleArrowLeft() {
        if (this.textController.isCursorInTextSelection()) return this.handleArrowLeftOnSelectionEnd();
        this.cursorOperation.moveCursorLeft();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowRight() {
        if (this.textController.isCursorInTextSelection()) return this.handleArrowRightOnSelectionEnd();
        this.cursorOperation.moveCursorRight();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowUp() {
        if (this.textController.isCursorInTextSelection()) return this.handleArrowUpOnSelectionEnd();
        this.cursorOperation.moveCursorUp();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowDown() {
        if (this.textController.isCursorInTextSelection()) return this.handleArrowDownOnSelectionEnd();
        this.cursorOperation.moveCursorDown();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public executeCommand(key: string) {
        if (this.commands[key] === undefined) return false;
        console.log(key, 'command found');
        this.commands[key].execute();
        return true;
    }

    public handleArrowLeftOnSelectionEnd() {
        const [start, end] = this.cursorOperation.getCursorPositionsStartAndEnd();
        this.cursorOperation.moveCursor(start);
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowRightOnSelectionEnd() {
        const [start, end] = this.cursorOperation.getCursorPositionsStartAndEnd();
        this.cursorOperation.moveCursor(end);
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowUpOnSelectionEnd() {
        const [start, end] = this.cursorOperation.getCursorPositionsStartAndEnd();
        this.cursorOperation.moveCursor(start);
        this.cursorOperation.moveCursorUp();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowDownOnSelectionEnd() {
        const [start, end] = this.cursorOperation.getCursorPositionsStartAndEnd();
        this.cursorOperation.moveCursor(end);
        this.cursorOperation.moveCursorDown();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public enableCombinationKey(key: string) {
        this.combinationKeyState.enableKey(key);
    }

    public isCombinationKeyEnabled(key: string): boolean {
        return this.combinationKeyState.isKeyEnabled(key);
    }

    public keyCombinationDisableAllKeys() {
        return this.combinationKeyState.disableAllKeys();
    }
}