import {CanvasContainer} from "./CanvasContainer";
import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";
import {DocumentService} from "./DocumentService";
import {DocumentSizes} from "./interfaces/interfaces";

export function getElementPadding(element: HTMLElement) {
    const styles = window.getComputedStyle(element);

    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingTop = parseFloat(styles.paddingTop);
    return {x: paddingLeft, y: paddingTop};
}

export function getNewCanvasElement() {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = 595;
    canvasElement.height = 892;
    // @ts-ignore
    document.querySelector(".canvas-container").appendChild(canvasElement);
    canvasElement.classList.add("m-4");
    canvasElement.classList.add("p-6");
    canvasElement.classList.add("cursor-text");

    return canvasElement;
}