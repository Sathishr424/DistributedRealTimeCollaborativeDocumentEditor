import {RawEditor} from "../RawEditor";
import {DefaultEditorConfig} from "../../../../interfaces/DefaultEditorConfig";
import {DocumentRenderer} from "../DocumentRenderer";
import {DocumentService} from "../DocumentService";
import {KeyCommand} from "../handler/KeyCommand";

export type CommandMap = Record<string, KeyCommand>;

export const config: DefaultEditorConfig = {
    font: "monospace",
    fontSize: 16,
    color: "black",
    selectionColor: "rgba(0,0,255,0.57)",
    lineHeight: 20,
    cursorColor: 'black',
    cursorWidth: 1,
    tabSize: 4,
    canPassthroughCharacters: "abcdefghijklmnopqrstABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890_",
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