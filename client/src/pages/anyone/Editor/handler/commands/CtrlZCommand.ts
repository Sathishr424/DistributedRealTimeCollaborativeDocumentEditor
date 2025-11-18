import {KeyCommand, KeyCommandParent} from "../KeyCommand";

export class CtrlZCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.textController.undo();
    }
}