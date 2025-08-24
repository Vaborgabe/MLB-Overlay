import { useContext, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { GameManager } from "../gameManager/gameManager";
import { Hosts } from "../hosts/hosts";
import { Players } from '../players/players';
import { socketCtx } from '../socketIOCtx/socketIOCtx';

export function HostControls() {
    const socket = useContext(socketCtx);

    useEffect(() => {
        if(socket) {
            console.log('test 1');
            
            socket.on('gameEvent', (name: string, action: string) => {
                console.log('test 2');
                
                toast.info(`${name}: ${action}`);
            });
        }
    }, [socket]);

    return (
        <>
            <Toaster
                position='top-right'
                theme='dark'
                richColors
            />
            <Hosts />
            <GameManager />
            <Players />
        </>
    )
}