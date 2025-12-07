import {KeyEvent} from "../../utils/KeyEvent";
import {KeyCombination} from "./KeyCombination";
import {TextKey} from "./TextKey";
import {InputController} from "../../ServiceClasses/InputController";
import {TextController} from "../../ServiceClasses/TextController";

export class KeyEvents {
    private events: KeyEvent[] = [];
    private inputController: InputController;

    constructor(inputController: InputController, textController: TextController) {
        this.inputController = inputController;
        this.events.push(new KeyCombination(inputController, textController));
        this.events.push(new TextKey(inputController, textController));
    }

    handleKeyDown(e: KeyboardEvent) {
        for (let event of this.events) {
            if (event.handle(e)) {
                break;
            }
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        this.inputController.keyCombinationDisableAllKeys();
    }
}