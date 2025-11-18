import {KeyEvent} from "../../interfaces/KeyEvent";
import {KeyCombination} from "./KeyCombination";
import {TextKey} from "./TextKey";
import {DocumentService} from "../../DocumentService";
import {CombinationKeyState} from "../../interfaces/CombinationKeyState";

export class KeyEvents {
    private events: KeyEvent[] = [];

    constructor(service: DocumentService) {
        this.events.push(new KeyCombination(service));
        this.events.push(new TextKey(service));
    }

    handleKeyDown(e: KeyboardEvent) {
        for (let event of this.events) {
            if (event.handle(e)) {
                break;
            }
        }
    }

    handleKeyUp(e: KeyboardEvent, combinationKeyState: CombinationKeyState) {
        combinationKeyState.disableAllKeys();
    }
}