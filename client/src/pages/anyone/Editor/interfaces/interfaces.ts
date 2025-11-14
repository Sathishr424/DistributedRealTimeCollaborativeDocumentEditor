import {RawEditor} from "../RawEditor";
import {DefaultEditorConfig} from "../../../../interfaces/DefaultEditorConfig";
import {DocumentRenderer} from "../DocumentRenderer";

export const config: DefaultEditorConfig = {
    font: "monospace",
    fontSize: 16,
    color: "black",
    lineHeight: 20
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
    protected editor: RawEditor;
    protected renderer: DocumentRenderer

    constructor(editor: RawEditor, renderer: DocumentRenderer) {
        this.editor = editor;
        this.renderer = renderer;
    }
}