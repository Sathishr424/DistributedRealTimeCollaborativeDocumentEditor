import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class BackspaceCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.inputController.handleBackSpace();
    }
}