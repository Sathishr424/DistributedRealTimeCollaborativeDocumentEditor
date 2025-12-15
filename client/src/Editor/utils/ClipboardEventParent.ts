import {DocumentService} from "../DocumentService";
import {TextController} from "../ServiceClasses/TextController";
import {InputController} from "../ServiceClasses/InputController";

export class ClipboardEventParent {
    protected textController: TextController;
    protected inputController: InputController;

    constructor(textController: TextController, inputController: InputController) {
        this.textController = textController;
        this.inputController = inputController;
    }
}