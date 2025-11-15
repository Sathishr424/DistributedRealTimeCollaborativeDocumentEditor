import {DocumentService} from "../../DocumentService";
import {MyClipboardEvent} from "../../interfaces/MyClipboardEvent";
import {CopyCommand} from "../commands/ManualCommands/CopyCommand";
import {PasteCommand} from "../commands/ManualCommands/PasteCommand";

export class ClipboardEvents {
    private copyCommand: CopyCommand;
    private pasteCommand: PasteCommand;

    constructor(service: DocumentService) {
        this.copyCommand = new CopyCommand(service);
        this.pasteCommand = new PasteCommand(service);
    }

    executeCopyCommand(e: ClipboardEvent) {
        this.copyCommand.handle(e);
    }

    executePasteCommand(e: ClipboardEvent) {
        this.pasteCommand.handle(e);
    }
}