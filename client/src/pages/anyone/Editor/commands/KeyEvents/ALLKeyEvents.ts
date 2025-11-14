import {KeyEvent} from "./KeyEvent";
import {KeyCombination} from "./KeyCombination";
import {RawEditor} from "../../RawEditor";
import {TextKey} from "./TextKey";
import {SpecialKeys} from "./SpecialKeys";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class ALLKeyEvents {
    private events: KeyEvent[] = [];

    constructor(editor: RawEditor) {
        this.events.push(new KeyCombination(editor));
        this.events.push(new TextKey(editor));
        this.events.push(new SpecialKeys(editor));
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