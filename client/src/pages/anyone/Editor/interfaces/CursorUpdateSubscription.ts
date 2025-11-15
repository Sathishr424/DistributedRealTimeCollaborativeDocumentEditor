class CursorUpdateSubscription {
    private subscribers: HasSubscription[] = [];

    subscribe(subscription: HasSubscription) {
        // console.log("Subscribing to the cursor update", subscription);
        this.subscribers.push(subscription);
    }

    unsubscribe(subscription: HasSubscription) {
        this.subscribers = this.subscribers.filter(subscription => subscription !== subscription);
    }

    notifyAll(usage = "unknown") {
        for (let subscription of this.subscribers) {
            subscription.notify(usage);
        }
    }

    notifyForCursorUpdate() {
        for (let subscription of this.subscribers) {
            subscription.notify("CURSOR UPDATE");
        }
    }

    notifyForTextUpdate() {
        for (let subscription of this.subscribers) {
            subscription.notify("TEXT OPERATION");
        }
    }

    notifyForTextAndCursorUpdate() {
        for (let subscription of this.subscribers) {
            subscription.notify("CURSOR UPDATE");
            subscription.notify("TEXT OPERATION");
        }
    }

    notifyForTextSelection() {
        for (let subscription of this.subscribers) {
            subscription.notify("KEY EVENT TEXT SELECTION");
        }
    }

    clearAll() {
        this.subscribers = [];
    }
}

export default new CursorUpdateSubscription();