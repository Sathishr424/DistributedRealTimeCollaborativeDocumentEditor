import {CopyCommand} from "../commands/ClipboardCommands/CopyCommand";
import {PasteCommand} from "../commands/ClipboardCommands/PasteCommand";
import {CutCommand} from "../commands/ClipboardCommands/CutCommand";
import {TextController} from "../../ServiceClasses/TextController";

export class ClipboardEvents {
    private copyCommand: CopyCommand;
    private cutCommand: CopyCommand;
    private pasteCommand: PasteCommand;

    constructor(textController: TextController) {
        this.cutCommand = new CutCommand(textController);
        this.copyCommand = new CopyCommand(textController);
        this.pasteCommand = new PasteCommand(textController);
    }

    executeCutCommand(e: ClipboardEvent) {
        this.cutCommand.handle(e);
    }

    executeCopyCommand(e: ClipboardEvent) {
        this.copyCommand.handle(e);
    }

    executePasteCommand(e: ClipboardEvent) {
        this.pasteCommand.handle(e);
    }
}