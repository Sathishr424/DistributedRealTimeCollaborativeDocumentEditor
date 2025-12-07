import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class ArrowUpCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.inputController.handleArrowUp();
    }
}