import {KeyCommand} from "../KeyCommand";
import {DocumentService} from "../../DocumentService";

export class InsertTabCommand implements KeyCommand {
    service: DocumentService;
    constructor(service: DocumentService) {
        this.service = service;
    }

    execute(): void {
        this.service.handleInsertTab();
    }
}