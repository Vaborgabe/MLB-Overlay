import { useContext, useEffect, useState } from "react";
import type { Player } from "../../interfaces";
import { CollapseSection } from "../collapseSection/collapseSection";
import { HostCam } from "../hostCam.tsx/hostCam";
import { socketCtx } from "../socketIOCtx/socketIOCtx";
import styles from "./hosts.module.css";

export function Hosts() {
    const socket = useContext(socketCtx);
    const [hosts, setHosts] = useState<Player[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("hosts", (data: Player[]) => {
            setHosts(data);
            console.log("Received hosts:", data);
            
        });

        socket.emit("getHosts"); // Request the current list of hosts

        // Cleanup on unmount
        return () => {
            socket.off("hosts");
        };
    }, [socket]);

    return (
        <CollapseSection title="Hosts">
            <div className={styles.wrapper}>
                {hosts.map((host, index) => (
                    <HostCam p={host} key={index} />
                ))}
            </div>
        </CollapseSection>
    );
}