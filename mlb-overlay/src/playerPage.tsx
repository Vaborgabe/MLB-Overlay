import { useContext, useEffect, useState } from "react";
import { PlayerControls } from "./components/playerControls/playerControls";
import { PlayerSetup } from "./components/playerSetup/playerSetup";
import { socketCtx } from "./components/socketIOCtx/socketIOCtx";

function PlayerPage() {
    const socket = useContext(socketCtx);
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [vdoCode, setVdoCode] = useState<string | null>(null);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                if (playerName && vdoCode) {
                    console.log(`Emitting identify with playerName: ${playerName}, vdoCode: ${vdoCode}`);
                    socket.emit('identify', playerName, vdoCode);
                }
            });
        }

        return () => {
            socket?.off('connect');
        };
    }, [socket, playerName, vdoCode]);

    return (
        <>
            {playerName ?
                <PlayerControls vdoCode={vdoCode || ""} /> :
                <PlayerSetup cb={(n,v) => {
                    setPlayerName(n);
                    setVdoCode(v);
                }} />
            }
        </>
    );
}

export default PlayerPage;