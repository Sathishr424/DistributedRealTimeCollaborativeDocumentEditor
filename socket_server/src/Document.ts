
type Operation = Record<number, Object>;

interface SocketRequest {
    version: number;
    text: string;
    startIndex: number;
    endIndex: number;
    type: string
}

export class DocumentClass {
    private document_id: string;
    private operations: Operation = {};
    private latest_version = 0;
    private client

    constructor(document_id: string) {
        this.document_id = document_id;
    }

    public addInsertOperation(request: SocketRequest) {

    }

    public addDeleteOperation(request: SocketRequest) {

    }
}