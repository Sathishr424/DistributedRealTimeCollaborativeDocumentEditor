import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class ArrowLeftCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.inputController.handleArrowLeft();
    }
}