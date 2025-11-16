type Subscriber = (pages: number) => void;
class SubscriptionForPageCreation {
    private subscribedForCanvas: Subscriber[] = [];

    public subscribeForCanvas(callback: Subscriber): () => void {
        this.subscribedForCanvas.push(callback);

        return () => {
            this.subscribedForCanvas = this.subscribedForCanvas.filter(sub => sub !== callback);
        };
    };

    public notifySubscribersForCanvas(pages: number): void {
        console.log(`Subscribing for page ${pages}`);
        this.subscribedForCanvas.forEach(callback => callback(pages));
    }
}

export default new SubscriptionForPageCreation();