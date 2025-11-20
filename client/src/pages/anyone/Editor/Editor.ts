import {RawEditor} from "./RawEditor";
import {config, DocumentSizes} from "./utils/interfaces";
import {DocumentService} from "./DocumentService";
import {DocumentRenderer} from "./DocumentRenderer";
import CursorUpdateSubscription from "./utils/CursorUpdateSubscription";
import {CanvasContainer} from "./CanvasContainer";
import {getElementPadding, getNewCanvasElement, loadConfiguredFont} from "./Helpers";

class Editor {
    private canvasContainer!: CanvasContainer
    private editor!: RawEditor;
    private renderer!: DocumentRenderer;
    private service!: DocumentService;
    private sizes!: DocumentSizes
    private destroyed = false;

    private boundKeyDown!: (e: KeyboardEvent) => void;
    private boundKeyUp!: (e: KeyboardEvent) => void;
    private boundCopy!: (e: ClipboardEvent) => void;
    private boundCut!: (e: ClipboardEvent) => void;
    private boundPaste!: (e: ClipboardEvent) => void;
    private boundScroll!: (e: Event) => void;

    constructor() {
        this.init();
    }

    private async init() {
        await loadConfiguredFont();
        if (this.destroyed) return;
        this.canvasContainer = new CanvasContainer();
        const canvas = getNewCanvasElement();
        const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        this.canvasContainer.configCanvas(canvas, ctx);

        const charWidth = Math.ceil(ctx.measureText("A").width);
        let {width, height} = canvas.getBoundingClientRect();

        const padding = getElementPadding(canvas);

        this.sizes = {
            charWidth: charWidth,
            height: config.lineHeight,
            cols: Math.floor((width - padding.x * 2) / charWidth),
            rows: Math.floor((height - padding.x * 2) / config.lineHeight),
            pageHeight: config.canvasHeight + (config.canvasMargin + config.canvasPadding) * 2
        }
        console.log(this.sizes);

        canvas.remove();

        this.editor = new RawEditor(this.sizes);
        this.service = new DocumentService(this.canvasContainer, this.editor, this.sizes);

        this.boundKeyDown = this.service.onKeyDown.bind(this.service);
        this.boundKeyUp = this.service.onKeyUp.bind(this.service);
        this.boundCopy = this.service.onCopy.bind(this.service);
        this.boundCut = this.service.onCut.bind(this.service);
        this.boundPaste = this.service.onPaste.bind(this.service);
        this.boundScroll = this.service.onScroll.bind(this.service);

        this.attachEvents();
    }

    public attachEvents() {
        console.log("Attaching key events")
        document.addEventListener('keydown', this.boundKeyDown);
        document.addEventListener('keyup', this.boundKeyUp);
        document.addEventListener('copy', this.boundCopy);
        document.addEventListener('cut', this.boundCut);
        document.addEventListener('paste', this.boundPaste);
        document.querySelector(config.canvasContainerBodyClass)!.addEventListener('scroll', this.boundScroll);
    }

    public dispose(): void {
        console.log("Disposed");
        if (this.service) {
            document.removeEventListener('keydown', this.boundKeyDown);
            document.removeEventListener('keyup', this.boundKeyUp);
            document.removeEventListener('copy', this.boundCopy);
            document.removeEventListener('cut', this.boundCut);
            document.removeEventListener('paste', this.boundPaste);
            document.querySelector(config.canvasContainerBodyClass)!.removeEventListener('scroll', this.boundScroll);

            this.service.dispose();
        }
        // @ts-ignore
        this.editor = null;
        // @ts-ignore
        this.service = null;

        if (this.canvasContainer) {
            this.canvasContainer.clearCanvases();
        }
        CursorUpdateSubscription.clearAll();
        this.destroyed = true;
    }
}

export default Editor;