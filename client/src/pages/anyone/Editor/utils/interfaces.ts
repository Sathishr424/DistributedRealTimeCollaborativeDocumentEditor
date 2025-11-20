import {DefaultEditorConfig} from "../../../../interfaces/DefaultEditorConfig";
import {DocumentService} from "../DocumentService";
import {KeyCommand} from "../handler/KeyCommand";
import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";
import {CursorOperation} from "../ServiceClasses/CursorOperation";

export type CommandMap = Record<string, KeyCommand>;

export const config: DefaultEditorConfig = {
    font: "JetBrains Mono",
    fontSize: 15,
    fontPadding: 0,
    color: "black",
    canvasWidth: 700,
    canvasHeight: 1100,
    selectionColor: "rgba(0,0,255,0.57)",
    selectionHorizontalPadding: 20,
    lineHeight: 20,
    cursorColor: 'black',
    cursorWidth: 1,
    tabSize: 4,
    mouseInterval: 500,
    canPassthroughCharacters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890_",
    backgroundColor: "white",
    canvasContainerClass: ".canvas-container",
    canvasContainerBodyClass: ".document-body",
    canvasPadding: 25,
    canvasMargin: 25,
    viewportExtraRenderRows: 100
}

export interface RenderViewport {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}

export interface Vec2 {
    x: number,
    y: number
}

export interface DocumentSizes {
    cols: number;
    charWidth: number;
    charHeight: number;
    height: number;
    rows: number;
    pageHeight: number;
}

export interface HistoryOperation {
    timestamp: number;
    chain: boolean;
    position: number;
    text: string;
    handle(cursorOperation: CursorOperation, textController: TextController): void;
}