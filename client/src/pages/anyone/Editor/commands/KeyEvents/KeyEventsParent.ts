import {RawEditor} from "../../RawEditor";

export class KeyEventsParent {
    protected editor: RawEditor

    constructor(editor: RawEditor) {
        this.editor = editor
    }
}