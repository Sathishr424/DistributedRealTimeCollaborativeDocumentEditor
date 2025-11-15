import {DocumentService} from "../DocumentService";

export interface KeyCommand {
    service: DocumentService;
    execute(): void;
}