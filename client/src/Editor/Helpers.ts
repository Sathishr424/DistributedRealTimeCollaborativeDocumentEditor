import {config} from "./utils/interfaces";

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
    canvasElement.width = config.canvasWidth;
    canvasElement.height = config.canvasHeight;
    // @ts-ignore
    document.querySelector(config.canvasContainerClass).appendChild(canvasElement);
    canvasElement.style.margin = config.canvasMargin + "px";
    canvasElement.style.padding = config.canvasPadding + "px";
    canvasElement.classList.add("cursor-text");

    return canvasElement;
}