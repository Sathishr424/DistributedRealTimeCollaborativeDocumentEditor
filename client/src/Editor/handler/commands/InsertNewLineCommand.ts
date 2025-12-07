import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class InsertNewLineCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.inputController.handleInsertNewLine();
    }
}