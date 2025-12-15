import {DefaultEditorConfig} from "./DefaultEditorConfig";

export const config: DefaultEditorConfig = {
    font: "JetBrains Mono",
    fontSize: 20,
    fontPadding: 2,
    color: "black",
    canvasWidth: 800,
    canvasHeight: 1100,
    selectionColor: "rgba(0,30,182,0.6)",
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
    canvasPadding: 50,
    canvasMargin: 25,
    viewportExtraRenderRows: 100
}