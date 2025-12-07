import {RenderViewport} from "./interfaces";

export interface HasRenderSubscription {
    notify(viewport: RenderViewport): void;
}