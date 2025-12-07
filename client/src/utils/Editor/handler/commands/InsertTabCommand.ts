import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class InsertTabCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.inputController.handleInsertTab();
    }
}