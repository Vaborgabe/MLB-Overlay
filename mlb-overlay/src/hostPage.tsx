import { useContext, useEffect, useState } from "react";
import { HostControls } from "./components/hostControls/hostControls";
import { PlayerSetup } from "./components/playerSetup/playerSetup";
import { socketCtx } from "./components/socketIOCtx/socketIOCtx";

export function HostPage() {
    const socket = useContext(socketCtx);
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [vdoCode, setVdoCode] = useState<string | null>(null);
    console.log(vdoCode);

    useEffect(() => {
        console.log("HostPage useEffect");
        
        if (socket) {
            console.log("Socket is defined in HostPage");
            socket.on('connect', () => {
                console.log("Socket connected in HostPage");
                
                if (playerName != null && vdoCode != null) {
                    console.log(`Emitting identify with playerName: ${playerName}, vdoCode: ${vdoCode}`);
                    socket.emit('identify', playerName, vdoCode);
                }
            });

            
            socket.on('identify', () => {
                if (playerName && vdoCode) socket.emit('identify', playerName, vdoCode);
            });
        }

        return () => {
            // socket?.off('connect');
            socket?.off('identify');
        };
    }, [socket, playerName, vdoCode]);
    

    return (
        <>
            {playerName ?
                <HostControls /> :
                <PlayerSetup cb={(n, v) => {
                    console.log(`Setting playerName: ${n}, vdoCode: ${v}`);
                    
                    setPlayerName(n);
                    setVdoCode(v);
                }} />
            }
        </>
    );
}