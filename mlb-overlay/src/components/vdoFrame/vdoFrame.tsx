import React from "react";
import styles from "./vdoFrame.module.css";

interface Props {
    code: string;
    volume: number;
}

const VDOFrame = (props: Props) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    React.useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage({
                "volume": props.volume/100
            }, '*');
        }
    }, [props.volume]);

    return (
        <iframe
            ref={iframeRef}
            className={styles.iframe}
            src={`https://vdo.ninja/?view=${props.code}&bitrate=10000&scale=100`}
            allow="document-domain;encrypted-media;sync-xhr;usb;web-share;cross-origin-isolated;midi *;geolocation;camera *;microphone *;fullscreen;picture-in-picture;display-capture;accelerometer;autoplay;gyroscope;screen-wake-lock;"
            style={{ width: '100%', height: '100%', outline: 'none', border: 'none', backgroundColor: 'transparent', zIndex: 0}}
            onMouseEnter={(e) => {
                e.preventDefault();
            }}
            onMouseLeave={(e) => {
                e.preventDefault();
            }}
            onMouseOver={(e) => {
                e.preventDefault();
            }}
        />
    )
}

export default VDOFrame;