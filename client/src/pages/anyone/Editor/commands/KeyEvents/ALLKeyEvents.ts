import {KeyEvent} from "./KeyEvent";
import {KeyCombination} from "./KeyCombination";
import {TextKey} from "./TextKey";
import {SpecialKeys} from "./SpecialKeys";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";
import {DocumentService} from "../../DocumentService";

export class ALLKeyEvents {
    private events: KeyEvent[] = [];

    constructor(service: DocumentService) {
        this.events.push(new KeyCombination(service));
        this.events.push(new TextKey(service));
        this.events.push(new SpecialKeys(service));
    }

    handle(e: KeyboardEvent) {
        for (let event of this.events) {
            if (!event.handle(e)) {
                CursorUpdateSubscription.notifyAll("KEY EVENT");
                break;
            }
        }
    }
}