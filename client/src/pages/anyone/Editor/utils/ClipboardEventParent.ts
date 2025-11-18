import {DocumentService} from "../DocumentService";
import {TextController} from "../ServiceClasses/TextController";

export class ClipboardEventParent {
    protected textController: TextController

    constructor(textController: TextController) {
        this.textController = textController;
    }
}