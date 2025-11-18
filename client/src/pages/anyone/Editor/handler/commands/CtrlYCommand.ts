import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class CtrlYCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.textController.redo();
    }
}