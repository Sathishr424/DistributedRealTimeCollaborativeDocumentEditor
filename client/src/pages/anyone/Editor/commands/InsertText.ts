import {EditorOperation, InsetOperation} from "../interfaces/interfaces";
import {RawEditor} from "@utils/RawEditor";
import {DocumentRenderer} from "../DocumentRenderer";

export class InsertText extends EditorOperation {
    constructor(editor: RawEditor, renderer: DocumentRenderer) {
        super(editor, renderer);
    }

    handle(options: InsetOperation): void {
        this.editor.insert(options.char);
        this.renderText();
    }
}