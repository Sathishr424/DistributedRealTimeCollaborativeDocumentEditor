import {io, Socket} from "socket.io-client";
import JWTService from "../../services/JWTService";
import {SocketOperation, OperationType, DeleteOperation, InsertOperation} from "../../../../shared/SocketOperation";
import {TextController} from "./TextController";
import {getRandomString} from "@utils/helper";

const SOCKET_URL: string = import.meta.env.VITE_SOCKET_URL;

class SocketClass {
    private socket: Socket;
    private documentKey: string;
    private version: number = 0;
    private textController: TextController;
    private myId: string;
    private isLoaded: boolean = false;

    constructor(documentKey: string, textController: TextController) {
        this.documentKey = documentKey;
        this.textController = textController;
        this.myId = getRandomString(16);

        console.log(SOCKET_URL);
        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log("Client connected");

            this.socket.emit('connect_document', {documentKey, token: JWTService.getToken(), clientId: this.myId});
        });

        this.socket.on("operation", this.onReceive.bind(this));
        this.socket.on("server_document", (data: any) => {
            if (data.clientId === this.myId) {
                this.isLoaded = true;
                this.textController.insertInitialText(data.text);
                this.version = data.version;
            }
        });
    }

    public onReceive(data: SocketOperation) {
        if (!this.isLoaded) return;
        this.version = data.version;
        console.log("Receive:", data);
        if (data.type === OperationType.Insert) {
            this.textController.insertTextFromServer(data.startIndex, data.text);
        } else {
            this.textController.deleteTextFromServer(data.startIndex, data.text.length);
        }
    }

    public emitInsert(text: string, startIndex: number, endIndex: number): void {
        if (!this.isLoaded) return;
        this.emit({
            documentKey: this.documentKey,
            startIndex,
            endIndex,
            text,
            type: OperationType.Insert,
            version: this.version,
            senderId: this.myId,
        } as SocketOperation);
    }

    public emitDelete(text: string, startIndex: number, endIndex: number): void {
        if (!this.isLoaded) return;
        this.emit({
            documentKey: this.documentKey,
            startIndex,
            endIndex,
            text,
            type: OperationType.Delete,
            version: this.version,
            senderId: this.myId,
        } as SocketOperation);
    }

    private emit(socketData: SocketOperation) {
        console.log("Emit:", socketData);
        this.socket.emit("operation", socketData);
    }

    dispose(): void {
        this.socket.close();
    }
}

export default SocketClass