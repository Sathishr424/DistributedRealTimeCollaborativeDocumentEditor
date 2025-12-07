export class CombinationKeyState {
    private shiftKey: boolean = false;
    private ctrlKey: boolean = false;
    private altKey: boolean = false;
    private metaKey: boolean = false;

    public disableAllKeys(): void {
        this.shiftKey = false;
        this.ctrlKey = false;
        this.altKey = false;
        this.metaKey = false;
    };

    public isKeyEnabled(key: string) {
        switch (key) {
            case "shift":
                return this.shiftKey;
            case "ctrl":
                return this.ctrlKey;
            case "alt":
                return this.altKey;
            case "meta":
                return this.metaKey;
            default:
                return false;
        }
    }

    public enableKey(key: string) {
        switch (key) {
            case "shift":
                this.shiftKey = true;
                break;
            case "ctrl":
                this.ctrlKey = true;
                break;
            case "alt":
                this.altKey = true;
                break;
            case "meta":
                this.metaKey = true;
                break;
            default:
                break;
        }
    }

    public disableKey(key: string) {
        switch (key) {
            case "shift":
                this.shiftKey = false;
                break;
            case "ctrl":
                this.ctrlKey = false;
                break;
            case "alt":
                this.altKey = false;
                break;
            case "meta":
                this.metaKey = false;
                break;
            default:
                break;
        }
    }
}