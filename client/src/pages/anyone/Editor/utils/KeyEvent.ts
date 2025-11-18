export interface KeyEvent {
    type: string;
    handle(e: KeyboardEvent): boolean;
}