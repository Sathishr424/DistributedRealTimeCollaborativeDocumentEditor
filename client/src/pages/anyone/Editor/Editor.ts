import {RawEditor} from "./RawEditor";
import {config, DocumentSizes} from "./interfaces/interfaces";
import {DocumentService} from "./DocumentService";
import {DocumentRenderer} from "./DocumentRenderer";
import CursorUpdateSubscription from "./interfaces/CursorUpdateSubscription";

const sampleText: string = "class Solution {\npublic:\n    int maxOperations(string s) {\n        int n = s.length();\n        int ans = 0;\n        int i = n-1;\n        while (i >= 0 && s[i] == '1') {\n            i--;\n        }\n        bool first = true;\n        int ones = 0;\n        while (i >= 0) {\n            if (s[i] == '1') {\n                int add = 0;\n                if (s[i + 1] == '0') add++;\n                while (i >= 0 && s[i] == '1') {\n                    ans+=ones + 1;\n                    i--;\n                }\n                ones += add;\n            }\n            i--;\n        }\n\n        return ans;\n    }\n}";

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

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        console.log(this.canvas);
        this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        const charWidth = this.ctx.measureText("a").width;
        const {width} = this.canvas.getBoundingClientRect();
        const {left, top} = this.canvas.getBoundingClientRect();
        this.sizes = {
            charWidth: charWidth,
            height: config.lineHeight,
            cols: Math.floor((width - charWidth) / charWidth),
            left: left,
            top: top
        }

        this.editor = new RawEditor(this.sizes);
        this.renderer = new DocumentRenderer(this.ctx, this.canvas, this.editor);
        this.service = new DocumentService(this.renderer, this.editor);

        this.boundMouseMove = this.service.onMouseMove.bind(this.service);
        this.boundMouseUp = this.service.onMouseUp.bind(this.service);
        this.boundMouseDown = this.service.onMouseDown.bind(this.service);
        this.boundKeyDown = this.service.onKeyDown.bind(this.service);

        this.attachEvents();
    }

    public attachEvents() {
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);
        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        document.addEventListener('keydown', this.boundKeyDown);
        console.log("EVENTS")
    }

    public dispose() {
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mouseup', this.boundMouseUp);
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        document.removeEventListener('keydown', this.boundKeyDown);

        this.service.dispose();

        // @ts-ignore
        this.editor = null;
        // @ts-ignore
        this.renderer = null;
        // @ts-ignore
        this.service = null;

        CursorUpdateSubscription.clearAll();
        console.log('disposed');
    }
}

export default Editor;