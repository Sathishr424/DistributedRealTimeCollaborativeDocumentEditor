import {DocumentService} from "../../DocumentService";
import {MyClipboardEvent} from "../../interfaces/MyClipboardEvent";
import {CopyCommand} from "../commands/ClipboardCommands/CopyCommand";
import {PasteCommand} from "../commands/ClipboardCommands/PasteCommand";
import {CutCommand} from "../commands/ClipboardCommands/CutCommand";

export class ClipboardEvents {
    private copyCommand: CopyCommand;
    private cutCommand: CopyCommand;
    private pasteCommand: PasteCommand;

    constructor(service: DocumentService) {
        this.cutCommand = new CutCommand(service);
        this.copyCommand = new CopyCommand(service);
        this.pasteCommand = new PasteCommand(service);
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