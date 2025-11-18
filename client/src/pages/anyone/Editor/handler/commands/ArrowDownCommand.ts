import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class ArrowDownCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.inputController.handleArrowDown();
    }
}