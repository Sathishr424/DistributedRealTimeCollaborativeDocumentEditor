import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class ArrowRightCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.inputController.handleArrowRight();
    }
}