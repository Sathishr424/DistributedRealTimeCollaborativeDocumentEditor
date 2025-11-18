import {DocumentService} from "../DocumentService";

export class KeyEventsParent {
    protected service: DocumentService

    constructor(service: DocumentService) {
        this.service = service;
    }
}