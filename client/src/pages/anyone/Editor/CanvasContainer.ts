import {config} from "./interfaces/interfaces";
import {DocumentService} from "./DocumentService";
import CursorUpdateSubscription from "./interfaces/CursorUpdateSubscription";
import {getNewCanvasElement} from "./Helpers";

type callbackType = (e: any) => void;
type CanvasEvent = Record<string, callbackType>;

interface CanvasObject {
    canvas: HTMLCanvasElement,
    events: CanvasEvent
}

export class CanvasContainer {
    public canvasObjects: CanvasObject[] = [];

    constructor() {
    }

    public getCanvasesTotal(): number {
        return this.canvasObjects.length;
    }

    public getCanvas(index: number): HTMLCanvasElement {
        // console.log(index, this.canvasObjects.length);
        return this.canvasObjects[index].canvas;
    }

    public clearCanvases(): void {
        while (this.canvasObjects.length > 0) {
            this.popCanvas();
        }
    }

    private loadConfig(canvas: HTMLCanvasElement) {
        const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        canvas.style.backgroundColor = config.backgroundColor;
        ctx.fillStyle = config.color;
        ctx.font = `${config.fontSize}px ${config.font}`;
    }

    public appendCanvasNew(service: DocumentService): void {
        const canvas = getNewCanvasElement();
        this.loadConfig(canvas);
        canvas.setAttribute("page", this.getCanvasesTotal().toString());
        const canvasObject: CanvasObject = {canvas: canvas, events: this.attachEvents(canvas, service)};
        this.canvasObjects.push(canvasObject);
    }

    public appendCanvas(canvas: HTMLCanvasElement, service: DocumentService): void {
        this.loadConfig(canvas);
        canvas.setAttribute("page", this.getCanvasesTotal().toString());
        const canvasObject: CanvasObject = {canvas: canvas, events: this.attachEvents(canvas, service)};
        this.canvasObjects.push(canvasObject);
    }

    public popCanvas(): void {
        const canvasObject = this.canvasObjects.pop();
        if (canvasObject) {
            canvasObject.canvas.remove();
            this.disposeEvents(canvasObject);
        }
    }

    public attachEvents(canvas: HTMLCanvasElement, service: DocumentService): CanvasEvent {
        console.log(service);
        const boundMouseMove = service.onMouseMove.bind(service);
        const boundMouseUp = service.onMouseUp.bind(service);
        const boundMouseDown = service.onMouseDown.bind(service);

        canvas.addEventListener('mousemove', boundMouseMove);
        canvas.addEventListener('mouseup', boundMouseUp);
        canvas.addEventListener('mousedown', boundMouseDown);

        const events: CanvasEvent = {};
        events["mousemove"] = boundMouseMove;
        events["mouseup"] = boundMouseUp;
        events["mousedown"] = boundMouseDown;

        return events;
    }

    public disposeEvents(canvasObject: CanvasObject) {
        const { canvas, events } = canvasObject;

        canvas.removeEventListener('mousemove', events["mousemove"]);
        canvas.removeEventListener('mouseup', events["mouseup"]);
        canvas.removeEventListener('mousedown', events["mousedown"]);
    }
}