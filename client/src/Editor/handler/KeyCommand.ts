import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";
import {InputController} from "../ServiceClasses/InputController";
import {CursorOperation} from "../ServiceClasses/CursorOperation";
import SocketClass from "../ServiceClasses/SocketClass";

export class KeyCommandParent {
    protected inputController: InputController;
    protected layout: LayoutEngine;
    protected textController: TextController
    protected cursorOperation: CursorOperation;

    constructor(inputController: InputController, layout: LayoutEngine, textController: TextController, cursorOperation: CursorOperation) {
        this.inputController = inputController;
        this.layout = layout;
        this.textController = textController;
        this.cursorOperation = cursorOperation;
    }
}

export interface KeyCommand {
    execute(): void;
}