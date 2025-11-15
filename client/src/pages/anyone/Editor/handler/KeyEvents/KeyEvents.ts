import {KeyEvent} from "../../interfaces/KeyEvent";
import {KeyCombination} from "./KeyCombination";
import {TextKey} from "./TextKey";
import {DocumentService} from "../../DocumentService";

export class KeyEvents {
    private events: KeyEvent[] = [];

    constructor(service: DocumentService) {
        this.events.push(new KeyCombination(service));
        this.events.push(new TextKey(service));
    }

    handle(e: KeyboardEvent) {
        for (let event of this.events) {
            if (event.handle(e)) {
                break;
            }
        }
    }
}