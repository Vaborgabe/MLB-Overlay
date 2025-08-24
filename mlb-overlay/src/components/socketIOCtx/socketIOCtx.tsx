import React, { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const socketCtx = createContext<Socket | null>(null);

export function SocketProvider({ children, namespace }: { children: React.ReactNode, namespace: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`https://mlbio.vaporgabe.com/${namespace}`, {transports: ['websocket'], upgrade: false}); // Adjust the URL as needed
        //setSocket(newSocket);

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected '+ new Date().toISOString());
        });
        newSocket.on('connect', () => {
            console.log('Socket connected'+ new Date().toISOString());
            setSocket(newSocket);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <socketCtx.Provider value={socket}>
            {children}
        </socketCtx.Provider>
    );
}