import { useContext, useEffect, useState } from "react";
import type { Player } from "../../interfaces";
import { CollapseSection } from "../collapseSection/collapseSection";
import { PlayerCam } from "../playerCam/playerCam";
import { socketCtx } from "../socketIOCtx/socketIOCtx";
import styles from "./players.module.css";

export function Players() {
    const socket = useContext(socketCtx);
    const [hosts, setHosts] = useState<Player[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("players", (data: Player[]) => {
            setHosts(data);
            console.log("Received players:", data);
            
        });

        socket.emit("getPlayers"); // Request the current list of hosts

        // Cleanup on unmount
        return () => {
            socket.off("players");
        };
    }, [socket]);

    return (
        <CollapseSection title="Players">
            <div className={styles.wrapper}>
                {hosts.map((host, index) => (
                    <PlayerCam p={host} key={index} />
                ))}
            </div>
        </CollapseSection>
    );
}