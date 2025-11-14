import {RawEditor} from "@utils/RawEditor";
import {DefaultEditorConfig} from "../../../../interfaces/DefaultEditorConfig";
import {MouseEvent} from "react";
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

export interface InsetOperation {
    char: string,
}

export interface UpdateOperation {
    pos: Vec2
}

export interface EmptyOperation {

}

export interface EditorOperationsHandle<T> {
    handle(options: T): void;
}

export interface EditorOperationConfig {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    editor: RawEditor;
    sizes: DocumentSizes
}

export interface DocumentSizes {
    cols: number;
    width: number
    height: number;
}

export interface OperationType {
    type: string,
    handle(e?: unknown): void;
}

export interface KeyBoardOperation extends OperationType {
    handle(e: KeyboardEvent): void;
}

export interface MouseOperation extends OperationType {
    handle(e: MouseEvent): void;
}

export interface TextOperation extends OperationType {
    handle(): void;
}

export class EditorOperation {
    protected editor: RawEditor;
    protected renderer: DocumentRenderer

    constructor(editor: RawEditor, renderer: DocumentRenderer) {
        this.editor = editor;
        this.renderer = renderer;
    }
}