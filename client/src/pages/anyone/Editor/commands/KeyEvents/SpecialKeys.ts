import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {DocumentService} from "../../DocumentService";

export class SpecialKeys extends KeyEventsParent implements KeyEvent{
    type = "SpecialKeys";
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        switch (key) {
            case "Backspace":
                this.service.handleBackSpace();
                e.preventDefault();
                return false;
            case "Enter":
                this.service.handleInsertNewLine();
                e.preventDefault();
                return false;
            case "ArrowLeft":
                this.service.handleArrowLeft();
                e.preventDefault();
                return false;
            case "ArrowUp":
                this.service.handleArrowUp();
                e.preventDefault();
                return false;
            case "ArrowRight":
                this.service.handleArrowRight();
                e.preventDefault();
                return false;
            case "ArrowDown":
                this.service.handleArrowDown();
                e.preventDefault();
                return false;
            default:
                break;
        }

        return true;
    }
}