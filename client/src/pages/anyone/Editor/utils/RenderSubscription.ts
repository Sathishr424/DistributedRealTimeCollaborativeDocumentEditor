import {RenderViewport} from "./interfaces";
import {HasRenderSubscription} from "./HasRenderSubscription";

class RenderSubscription {
    private subscribers: HasRenderSubscription[] = [];

    public subscribe(subscription: HasRenderSubscription) {
        this.subscribers.push(subscription);
    }

    public notify(viewport: RenderViewport) {
        console.log("RenderSubscription", viewport);
        for (let subscription of this.subscribers) {
            subscription.notify(viewport);
        }
    }

    public clearAll() {
        this.subscribers = [];
    }
}

export default new RenderSubscription();