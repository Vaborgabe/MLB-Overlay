import { useContext, useEffect, useState } from "react";
import type { Player } from "../../interfaces";
import { CollapseRemSection } from "../collapseRemSection/collapseRemSection";
import { socketCtx } from "../socketIOCtx/socketIOCtx";
import VDOFrame from "../vdoFrame/vdoFrame";
import styles from "./hostCam.module.css";

export function HostCam({p}: {p: Player}) {
    const socket = useContext(socketCtx);
    const [vol, setVol] = useState(p.volume*100 || 50);
    const [name, setName] = useState(p.name);
    const [code, setCode] = useState(p.vdoCode);

    function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newVolume = parseInt(event.target.value, 10);
        setVol(newVolume);
        if (socket) {
            socket.emit('setVolume', p.vdoCode, newVolume/100 );
        }
    }

    useEffect(() => {
        if(p.muted) {
            setVol(0);
        } else if(p.volume !== undefined && p.volume >= 0 && p.volume <= 100 && p.volume !== vol) {
            setVol(p.volume*100);
        }
    }, [p.volume, p.muted]);

    useEffect(() => {
        setName(p.name);
        setCode(p.vdoCode);
    }, [p.name, p.vdoCode]);

    function handleRemove() {
        if (socket) {
            socket.emit('removeHost', code);
        }
    }

    return (
        <div className={styles.wrapper}>
            <CollapseRemSection title={name}>
                <VDOFrame code={code} volume={vol} />
            </CollapseRemSection>
            <div className={styles.settingTitle}>Volume:</div>
            <input type="range" min={0} max={100} value={vol} className={styles.volumeSlider} onChange={handleVolumeChange}/>
            <div className={styles.button} onClick={handleRemove}>Remove</div>
        </div>
    )
}