import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class DeleteCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.inputController.handleDeleteKey();
    }
}