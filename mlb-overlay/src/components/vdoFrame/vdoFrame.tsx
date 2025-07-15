import React from "react";
import styles from "./vdoFrame.module.css";

interface Props {
    x: number;
    y: number;
    sX: number;
    sY: number;
}

const VDOFrame = (props: Props) => {
    const [transform, setTransform] = React.useState<number[]>([0, 0, 0, 0]);
    
    React.useEffect(() => {
        const { x, y, sX, sY } = props;
        const newTransform = transform;
        if(x) newTransform[0] = x;
        if(y) newTransform[1] = y;
        if(sX) newTransform[2] = sX;
        if(sY) newTransform[3] = sY;
        setTransform(newTransform);
    }, [props]);

    return (
        <div
            className={styles.wrapper}
            style={{
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]}, ${transform[3]}) `,
            }}
        >
            <iframe
                className={styles.vdoFrame}
                src="https://vdo.ninja/?view=Md7G9Zj&solo&room=broughtshowc&label=p1OBS"
                allow="document-domain;encrypted-media;sync-xhr;usb;web-share;cross-origin-isolated;midi *;geolocation;camera *;microphone *;fullscreen;picture-in-picture;display-capture;accelerometer;autoplay;gyroscope;screen-wake-lock;"
            />
        </div>
    )
}

export default VDOFrame;