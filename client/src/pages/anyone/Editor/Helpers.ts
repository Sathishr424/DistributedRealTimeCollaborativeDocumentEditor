import {CanvasContainer} from "./CanvasContainer";
import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";
import {DocumentService} from "./DocumentService";
import {config, DocumentSizes} from "./utils/interfaces";

export function getElementPadding(element: HTMLElement) {
    const styles = window.getComputedStyle(element);

    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingTop = parseFloat(styles.paddingTop);
    return {x: paddingLeft, y: paddingTop};
}

export function loadConfiguredFont(): Promise<boolean> {
    return new Promise((resolve) => {
        const fontLoadString = `400 ${config.fontSize}px ${config.font}`
        document.fonts.load(fontLoadString)
            .then(() => {
                console.log(`${config.font} font successfully loaded.`);
                resolve(true);
            })
            .catch(error => {
                console.error("Error loading font:", error);
                resolve(true);
            });
    })
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