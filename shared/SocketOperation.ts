export enum OperationType {
    Insert = "insert",
    Delete = "delete",
}

export interface BaseOperation {
    version: number;
    documentKey: string;
    text: string;
    startIndex: number;
    endIndex: number;
    senderId: string;
}

export interface InsertOperation extends BaseOperation {
    type: OperationType.Insert;
}

export interface DeleteOperation extends BaseOperation {
    type: OperationType.Delete;
}

export type SocketOperation = InsertOperation | DeleteOperation;