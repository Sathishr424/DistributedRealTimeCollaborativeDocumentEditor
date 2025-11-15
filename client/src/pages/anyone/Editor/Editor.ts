import {RawEditor} from "./RawEditor";
import {config, DocumentSizes} from "./interfaces/interfaces";
import {DocumentService} from "./DocumentService";
import {DocumentRenderer} from "./DocumentRenderer";
import CursorUpdateSubscription from "./interfaces/CursorUpdateSubscription";

class Editor {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private editor: RawEditor;
    private renderer: DocumentRenderer;
    private service: DocumentService;
    private sizes: DocumentSizes

    private boundMouseMove: (e: MouseEvent) => void;
    private boundMouseUp: (e: MouseEvent) => void;
    private boundMouseDown: (e: MouseEvent) => void;
    private boundKeyDown: (e: KeyboardEvent) => void;
    private boundCopy: (e: ClipboardEvent) => void;
    private boundPaste: (e: ClipboardEvent) => void;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        const charWidth = Math.ceil(this.ctx.measureText("a").width);
        const {width} = this.canvas.getBoundingClientRect();
        const {left, top} = this.canvas.getBoundingClientRect();
        this.sizes = {
            charWidth: charWidth,
            height: config.lineHeight,
            cols: Math.floor(width / charWidth),
            left: left,
            top: top
        }
        console.log(this.sizes)

        this.editor = new RawEditor();
        this.renderer = new DocumentRenderer(this.ctx, this.canvas, this.editor, this.sizes);
        this.service = new DocumentService(this.renderer, this.editor, this.sizes);

        this.boundMouseMove = this.service.onMouseMove.bind(this.service);
        this.boundMouseUp = this.service.onMouseUp.bind(this.service);
        this.boundMouseDown = this.service.onMouseDown.bind(this.service);
        this.boundKeyDown = this.service.onKeyDown.bind(this.service);
        this.boundCopy = this.service.onCopy.bind(this.service);
        this.boundPaste = this.service.onPaste.bind(this.service);

        this.attachEvents();
    }

    public attachEvents() {
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);
        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        document.addEventListener('keydown', this.boundKeyDown);
        document.addEventListener('copy', this.boundCopy);
        document.addEventListener('paste', this.boundPaste);
    }

    public dispose() {
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mouseup', this.boundMouseUp);
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        document.removeEventListener('keydown', this.boundKeyDown);
        document.removeEventListener('copy', this.boundCopy);
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