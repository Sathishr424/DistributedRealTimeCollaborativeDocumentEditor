class CursorUpdateSubscription {
    private subscribers: HasSubscription[] = [];

    subscribe(subscription: HasSubscription) {
        this.subscribers.push(subscription);
    }

    unsubscribe(subscription: HasSubscription) {
        this.subscribers = this.subscribers.filter(subscription => subscription !== subscription);
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
            subscription.notify("TEXT OPERATION");
            subscription.notify("CURSOR UPDATE");
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