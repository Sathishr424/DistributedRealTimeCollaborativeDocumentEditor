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
        return this.canvasObjects[index].canvas;
    }

    public clearCanvases(): void {
        while (this.canvasObjects.length > 0) {
            this.popCanvas();
        }
    }

    public configCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
        canvas.style.backgroundColor = config.backgroundColor;
        ctx.fillStyle = config.color;
        ctx.font = `${config.fontSize}px ${config.font}`;
    }

    private loadConfig(canvas: HTMLCanvasElement) {
        const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
        this.configCanvas(canvas, ctx);
    }

    public appendCanvasNew(service: DocumentService): void {
        const canvas = getNewCanvasElement();
        this.appendCanvas(canvas, service);
    }

    public appendCanvas(canvas: HTMLCanvasElement, service: DocumentService): void {
        this.loadConfig(canvas);
        canvas.setAttribute("page", this.getCanvasesTotal().toString());
        const canvasObject: CanvasObject = {canvas: canvas, events: this.attachAndReturnEvents(canvas, service)};
        this.canvasObjects.push(canvasObject);
    }

    public popCanvas(): void {
        const canvasObject = this.canvasObjects.pop();
        if (canvasObject) {
            canvasObject.canvas.remove();
            this.disposeEvents(canvasObject);
        }
    }

    public attachAndReturnEvents(canvas: HTMLCanvasElement, service: DocumentService): CanvasEvent {
        const events: CanvasEvent = {};
        events["mousemove"] = service.onMouseMove.bind(service);
        events["mouseup"] = service.onMouseUp.bind(service);
        events["mousedown"] = service.onMouseDown.bind(service);

        canvas.addEventListener('mousemove', events["mousemove"]);
        canvas.addEventListener('mouseup', events["mouseup"]);
        canvas.addEventListener('mousedown', events["mousedown"]);

        return events;
    }

    public disposeEvents(canvasObject: CanvasObject) {
        const { canvas, events } = canvasObject;

        canvas.removeEventListener('mousemove', events["mousemove"]);
        canvas.removeEventListener('mouseup', events["mouseup"]);
        canvas.removeEventListener('mousedown', events["mousedown"]);
    }
}