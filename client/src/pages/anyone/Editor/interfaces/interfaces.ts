import {RawEditor} from "../RawEditor";
import {DefaultEditorConfig} from "../../../../interfaces/DefaultEditorConfig";
import {DocumentRenderer} from "../DocumentRenderer";
import {DocumentService} from "../DocumentService";

export const config: DefaultEditorConfig = {
    font: "monospace",
    fontSize: 16,
    color: "black",
    lineHeight: 20,
    cursorColor: 'black',
    cursorWidth: 1
}

export interface Vec2 {
    x: number,
    y: number
}

export interface DocumentSizes {
    cols: number;
    charWidth: number
    height: number;
    left: number;
    top: number;
}

export class EditorOperation {
    protected service: DocumentService;

    constructor(service: DocumentService) {
        this.service = service;
    }
}