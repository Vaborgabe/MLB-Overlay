import { useContext, useState } from "react";
import { PlayerName } from "../playerName/playername";
import { socketCtx } from "../socketIOCtx/socketIOCtx";
import styles from './playerSetup.module.css';

export function PlayerSetup({ cb }: { cb: (name: string, vdoCode: string) => void }) {
    const socket = useContext(socketCtx);
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [vdoCode, setVdoCode] = useState<string | null>(null);

    function handleNameChange(name: string) {
        if (!socket) {
            console.error("Socket is not connected");
            return;
        }
        socket.emit('registerPlayer', name);
        setPlayerName(name);
    }

    socket?.on('vdoCode', (code: string) => {
        setVdoCode(code);
    });

    return (
        <>
            {playerName ?
                (vdoCode ?
                    (<div className={styles.wrapper}>
                        <div>OPEN LINK, CLICK SHARE YOUR CAMERA, IF HOST SET VIDEO TO WEBCAM, IF PLAYER SET VIDEO TO OBS VIRTUAL CAMERA, SET AUDIO TO MIC</div>
                        <a href={`https://vdo.ninja/?push=${vdoCode}&quality=0&vbo=10000`} target="_blank">VDO.Ninja</a>
                        <a onClick={() => {cb(playerName, vdoCode)}}>I have done this</a>
                    </div>) :
                    (<div>Waiting for VDO code...</div>)
                ) :
                (<PlayerName cb={(n) => {handleNameChange(n)}} />)
            }
        </>
    );
}