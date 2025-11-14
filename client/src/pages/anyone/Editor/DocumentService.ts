import {RawEditor} from "@utils/RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";

export class DocumentService {
    private renderer: DocumentRenderer;
    private editor: RawEditor

    constructor(renderer: DocumentRenderer, editor: RawEditor) {
        this.renderer = renderer;
        this.editor = editor;
    }
}