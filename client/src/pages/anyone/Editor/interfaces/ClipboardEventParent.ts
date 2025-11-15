import {DocumentService} from "../DocumentService";

export class ClipboardEventParent {
    protected service: DocumentService

    constructor(service: DocumentService) {
        this.service = service;
    }
}