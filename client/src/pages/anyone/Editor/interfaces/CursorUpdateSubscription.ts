class CursorUpdateSubscription {
    private subscribers: HasSubscription[] = [];

    subscribe(subscription: HasSubscription) {
        console.log("Subscribing to the cursor update", subscription);
        this.subscribers.push(subscription);
    }

    unsubscribe(subscription: HasSubscription) {
        this.subscribers = this.subscribers.filter(subscription => subscription !== subscription);
    }

    notifyAll(from = "unknown") {
        for (let subscription of this.subscribers) {
            subscription.notify();
        }
    }

    clearAll() {
        this.subscribers = [];
    }
}

export default new CursorUpdateSubscription();