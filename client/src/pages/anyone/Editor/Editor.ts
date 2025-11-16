import {RawEditor} from "./RawEditor";
import {config, DocumentSizes} from "./interfaces/interfaces";
import {DocumentService} from "./DocumentService";
import {DocumentRenderer} from "./DocumentRenderer";
import CursorUpdateSubscription from "./interfaces/CursorUpdateSubscription";
import {CanvasContainer} from "./CanvasContainer";

class Editor {
    private canvasContainer: CanvasContainer;
    private container: HTMLDivElement;
    private editor: RawEditor;
    private renderer: DocumentRenderer;
    private service: DocumentService;
    private sizes: DocumentSizes

    private boundMouseMove: (e: MouseEvent) => void;
    private boundMouseUp: (e: MouseEvent) => void;
    private boundMouseDown: (e: MouseEvent) => void;
    private boundKeyDown: (e: KeyboardEvent) => void;
    private boundCopy: (e: ClipboardEvent) => void;
    private boundCut: (e: ClipboardEvent) => void;
    private boundPaste: (e: ClipboardEvent) => void;

    constructor(canvas: HTMLCanvasElement, container: HTMLDivElement, canvasContainer: CanvasContainer) {
        this.container = container;
        this.canvasContainer = canvasContainer;
        console.log(container, canvas)
        const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        const charWidth = Math.ceil(ctx.measureText("a").width);
        const {width, height} = canvas.getBoundingClientRect();

        this.sizes = {
            charWidth: charWidth,
            height: config.lineHeight,
            cols: Math.floor(width / charWidth),
            rows: Math.floor(height / config.lineHeight),
        }

        this.editor = new RawEditor();
        this.renderer = new DocumentRenderer(this.canvasContainer, this.editor, this.sizes);
        this.service = new DocumentService(this.canvasContainer, this.renderer, this.editor, this.sizes);

        this.boundMouseMove = this.service.onMouseMove.bind(this.service);
        this.boundMouseUp = this.service.onMouseUp.bind(this.service);
        this.boundMouseDown = this.service.onMouseDown.bind(this.service);
        this.boundKeyDown = this.service.onKeyDown.bind(this.service);
        this.boundCopy = this.service.onCopy.bind(this.service);
        this.boundCut = this.service.onCut.bind(this.service);
        this.boundPaste = this.service.onPaste.bind(this.service);

        this.attachEvents();
    }

    public attachEvents() {
        this.container.addEventListener('mousemove', this.boundMouseMove);
        this.container.addEventListener('mouseup', this.boundMouseUp);
        this.container.addEventListener('mousedown', this.boundMouseDown);
        document.addEventListener('keydown', this.boundKeyDown);
        document.addEventListener('copy', this.boundCopy);
        document.addEventListener('cut', this.boundCut);
        document.addEventListener('paste', this.boundPaste);
    }

    public dispose() {
        this.container.removeEventListener('mousemove', this.boundMouseMove);
        this.container.removeEventListener('mouseup', this.boundMouseUp);
        this.container.removeEventListener('mousedown', this.boundMouseDown);
        document.removeEventListener('keydown', this.boundKeyDown);
        document.removeEventListener('copy', this.boundCopy);
        document.removeEventListener('cut', this.boundCut);
        document.removeEventListener('paste', this.boundPaste);

        this.service.dispose();

        // @ts-ignore
        this.editor = null;
        // @ts-ignore
        this.renderer = null;
        // @ts-ignore
        this.service = null;

        CursorUpdateSubscription.clearAll();
    }
}

export default Editor;