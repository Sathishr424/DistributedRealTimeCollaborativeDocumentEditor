import {RawEditor} from "./RawEditor";
import * as fs from "node:fs";
import {documentPath} from "./helpers/helper";
import {OperationType, SocketOperation} from "../../shared/SocketOperation"

interface Op {
    start: number;
    end: number;
}

type Operation = Record<number, Op>;

export class MyDocument {
    private document_id: string;
    private insert_operations: Operation = {};
    private delete_operations: Operation = {};
    private latest_version = 0;
    private editor: RawEditor;
    private on_write_pending = 0;

    constructor(document_id: string) {
        this.document_id = document_id;
        this.editor = new RawEditor();
        this.editor.insertText(fs.readFileSync(documentPath(this.document_id), "utf8"));
    }

    public getFullText(): string {
        return this.editor.getFullText();
    }

    public getVersion(): number {
        return this.latest_version;
    }

    public processOperation(data: SocketOperation): SocketOperation {
        if (data.type === OperationType.Insert) {
            return this.addInsertOperation(data);
        } else {
            return this.addDeleteOperation(data);
        }
    }

    public saveDocumentToFile() {
        console.log("Saving:", this.editor.getFullText())
        fs.writeFileSync(documentPath(this.document_id), this.editor.getFullText(), "utf8");
    }

    public saveDocument() {
        const currTime = Date.now();
        if (currTime - this.on_write_pending >= 1000) {
            this.on_write_pending = currTime;
            this.saveDocumentToFile();
        }
    }

    public addInsertOperation(request: SocketOperation): SocketOperation {
        let pos: Op = {
            start: Math.max(0, request.startIndex),
            end: Math.max(request.endIndex)
        };
        console.log(request);
        for (let version = request.version + 1; version <= this.latest_version; version++) {
            if (this.insert_operations[version] !== undefined) {
                const op = this.insert_operations[version];
                if (op.start <= pos.start) {
                    const add = op.end - op.start + 1;
                    pos.start += add;
                    pos.end += add;
                }
            }
            if (this.delete_operations[version] !== undefined) {
                const op = this.delete_operations[version];
                if (op.start < pos.start) {
                    const add = Math.min(op.end, pos.start) - op.start + 1;
                    pos.start -= add;
                    pos.end -= add;
                }
            }
        }
        this.latest_version++;
        this.insert_operations[this.latest_version] = pos;
        this.editor.move(pos.start);
        this.editor.insertText(request.text);
        this.saveDocument();
        console.log("Editor:", this.editor.left, this.editor.right);
        return {
            ...request,
            version: this.latest_version,
            startIndex: pos.start,
            endIndex: pos.end
        }
    }

    public addDeleteOperation(request: SocketOperation): SocketOperation {
        let pos: Op = {
            start: Math.max(0, request.startIndex),
            end: Math.max(request.endIndex)
        };
        for (let version = request.version + 1; version <= this.latest_version; version++) {
            if (this.insert_operations[version] !== undefined) {
                const op = this.insert_operations[version];
                if (op.start <= pos.start) {
                    const add = op.end - op.start + 1;
                    pos.start += add;
                    pos.end += add;
                }
            }
            if (this.delete_operations[version] !== undefined) {
                const op = this.delete_operations[version];
                if (op.start < pos.start) {
                    if (op.end <= pos.start) {
                        const add = op.end - op.start + 1;
                        pos.start -= add;
                        pos.end -= add;
                    } else {
                        const add = Math.min(op.end, pos.start) - op.start + 1;
                        const diff = Math.min(pos.end - pos.start, op.end - pos.start);
                        pos.end -= diff;
                        pos.start -= add;
                        pos.end -= add;
                    }
                }
            }
        }
        if (pos.end - pos.start + 1 > 0) {
            this.latest_version++;
            this.delete_operations[this.latest_version] = pos;
            this.editor.move(pos.start);
            this.editor.deleteRight(pos.end - pos.start);
        }
        this.saveDocument();
        console.log("Editor:", this.editor.left, this.editor.right);
        return {
            ...request,
            version: this.latest_version,
            startIndex: pos.start,
            endIndex: pos.end
        }
    }
}