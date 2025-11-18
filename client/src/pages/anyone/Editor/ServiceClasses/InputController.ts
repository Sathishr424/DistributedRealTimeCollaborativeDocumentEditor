import CursorUpdateSubscription from "../utils/CursorUpdateSubscription";
import {CommandMap, config} from "../utils/interfaces";
import {LayoutEngine} from "./LayoutEngine";
import {TextController} from "./TextController";
import {initializeCommands} from "../CommandRegistry";
import {CombinationKeyState} from "../utils/CombinationKeyState";

export class InputController {
    private layout: LayoutEngine;
    private textController: TextController;
    private readonly commands: CommandMap;
    private combinationKeyState: CombinationKeyState;

    constructor(layout: LayoutEngine, textController: TextController) {
        this.layout = layout;
        this.textController = textController;
        this.combinationKeyState = new CombinationKeyState();

        this.commands = initializeCommands(this, this.layout, this.textController);
    }

    public handleBackSpace() {
        if (!this.textController.deleteTextSelection()) {
            this.textController.backspace();
        }
        this.layout.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleInsertChar(char: string) {
        const change = this.textController.deleteTextSelection()
        this.textController.insertChar(char, change);
    }

    public handleInsertTab() {
        this.textController.deleteTextSelection()
        this.textController.insertText(new Array(config.tabSize).fill(0).join(''));
    }

    public handleInsertNewLine() {
        const change = this.textController.deleteTextSelection()
        this.textController.insertChar('\n', change);
    }

    public handleArrowLeft() {
        if (this.textController.isCursorInTextSelection()) return this.handleArrowLeftOnSelectionEnd();
        this.layout.moveCursorLeft();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowRight() {
        if (this.textController.isCursorInTextSelection()) return this.handleArrowRightOnSelectionEnd();
        this.layout.moveCursorRight();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowUp() {
        if (this.textController.isCursorInTextSelection()) return this.handleArrowUpOnSelectionEnd();
        this.layout.moveCursorUp();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowDown() {
        if (this.textController.isCursorInTextSelection()) return this.handleArrowDownOnSelectionEnd();
        this.layout.moveCursorDown();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public executeCommand(key: string) {
        if (this.commands[key] === undefined) return false;
        console.log(key, 'command found');
        this.commands[key].execute();
        return true;
    }

    public handleArrowLeftOnSelectionEnd() {
        const [start, end] = this.layout.getCursorPositionsStartAndEnd();
        this.layout.moveCursor(start);
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowRightOnSelectionEnd() {
        const [start, end] = this.layout.getCursorPositionsStartAndEnd();
        this.layout.moveCursor(end);
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowUpOnSelectionEnd() {
        const [start, end] = this.layout.getCursorPositionsStartAndEnd();
        this.layout.moveCursor(start);
        this.handleArrowUp();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowDownOnSelectionEnd() {
        const [start, end] = this.layout.getCursorPositionsStartAndEnd();
        this.layout.moveCursor(end);
        this.handleArrowDown();
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