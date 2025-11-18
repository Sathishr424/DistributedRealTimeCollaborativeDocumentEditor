import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";
import {InputController} from "../ServiceClasses/InputController";

export class KeyCommandParent {
    protected inputController: InputController;
    protected layout: LayoutEngine;
    protected textController: TextController;

    constructor(inputController: InputController, layout: LayoutEngine, textController: TextController) {
        this.inputController = inputController;
        this.layout = layout;
        this.textController = textController;
    }
}

export interface KeyCommand {
    execute(): void;
}