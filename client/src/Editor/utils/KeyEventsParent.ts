import {DocumentService} from "../DocumentService";
import {TextController} from "../ServiceClasses/TextController";
import {InputController} from "../ServiceClasses/InputController";

export class KeyEventsParent {
    protected textController: TextController;
    protected inputController: InputController;

    constructor(inputController: InputController, textController: TextController) {
        this.inputController = inputController;
        this.textController = textController;
    }
}