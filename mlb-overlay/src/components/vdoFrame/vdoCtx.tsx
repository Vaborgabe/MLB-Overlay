import { createContext } from "react";

export class VdoIframe {
    private iframe: HTMLIFrameElement;
    private containerDiv: HTMLDivElement;
    public src: string;
    private x: number;
    private y: number;
    private sX: number;
    private sY: number;

    constructor(src: string) {
        this.src = src;
        this.x = 0;
        this.y = 0;
        this.sX = 0;
        this.sY = 0;

        this.containerDiv = document.createElement("div");
        this.containerDiv.style.width = "1920px";
        this.containerDiv.style.height = "1080px";
        this.containerDiv.style.zIndex = "100";
        this.containerDiv.style.position = "absolute";
        this.containerDiv.style.top = "0";
        this.containerDiv.style.left = "0";

        this.iframe = document.createElement("iframe");
        this.iframe.src = this.src;
        this.iframe.style.width = "100%";
        this.iframe.style.height = "100%";
        this.iframe.style.border = "none";
        this.iframe.allow = "document-domain;encrypted-media;sync-xhr;usb;web-share;cross-origin-isolated;midi *;geolocation;camera *;microphone *;fullscreen;picture-in-picture;display-capture;accelerometer;autoplay;gyroscope;screen-wake-lock;";
        this.containerDiv.appendChild(this.iframe);

        this.iframe.onload = () => {
            setTimeout(() => {
                this.iframe.contentWindow?.postMessage({
                    "bitrate": 6000,
                }, '*');
            }, 5000);
            this.iframe.contentWindow?.postMessage({
                "bitrate": 6000
            }, '*');
        }

        this.updateTransform();

        document.body.appendChild(this.containerDiv);
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.updateTransform();
    }

    setX(x: number) {
        this.x = x;
        this.updateTransform();
    }
    setY(y: number) {
        this.y = y;
        this.updateTransform();
    }

    setScale(sX: number, sY: number) {
        this.sX = sX;
        this.sY = sY;
        this.updateTransform();
    }

    setScaleX(sX: number) {
        this.sX = sX;
        this.updateTransform();
    }
    setScaleY(sY: number) {
        this.sY = sY;
        this.updateTransform();
    }
    
    updateTransform(x?: number, y?: number, sX?: number, sY?: number) {
        if (x !== undefined) this.x = x;
        if (y !== undefined) this.y = y;
        if (sX !== undefined) this.sX = sX;
        if (sY !== undefined) this.sY = sY;

        this.containerDiv.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.sX}, ${this.sY})`;
    }

    setSrc(src: string) {
        this.src = src;
        this.iframe.src = src;
    }

    remove() {
        if (this.containerDiv.parentNode) {
            this.containerDiv.parentNode.removeChild(this.containerDiv);
        }
    }
}

interface ctxType {
    p1Cam: VdoIframe;
    p2Cam: VdoIframe;
    hostCams: VdoIframe[];
}

export const vdoCTX = createContext<ctxType | undefined>(undefined);

