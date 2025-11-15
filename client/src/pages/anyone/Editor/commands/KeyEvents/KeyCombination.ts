import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {DocumentService} from "../../DocumentService";
import {OnTextSelectionInProgress} from "./Combinations/OnTextSelectionInProgress";
import {ShiftCombination} from "./Combinations/ShiftCombination";
import {CtrlCombination} from "./Combinations/CtrlCombination";

export class KeyCombination extends KeyEventsParent implements KeyEvent{
    type = "KeyCombination";
    private combinations: KeyEvent[] = [];
    constructor(service: DocumentService) {
        super(service);
        this.combinations.push(new ShiftCombination(service));
        this.combinations.push(new OnTextSelectionInProgress(service));
        this.combinations.push(new CtrlCombination(service));
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        for (let combination of this.combinations) {
            if (combination.handle(e)) return true;
        }

        return false;
    }
}