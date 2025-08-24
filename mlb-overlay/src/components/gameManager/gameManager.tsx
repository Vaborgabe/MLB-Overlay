import ClearIcon from '@mui/icons-material/Clear';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useContext, useEffect, useState } from "react";
import type { Gamestate } from "../../interfaces";
import { GameControls } from "../gameControls/gameControls";
import { socketCtx } from "../socketIOCtx/socketIOCtx";
import { Tabs } from "../tabs/tabs";
import styles from "./gameManager.module.css";

export function GameManager() {
    const socket = useContext(socketCtx);
    const [games, setGames] = useState<React.ReactNode[]>([]);
    const [gameObj, setGameObj] = useState<{[id: string]: Gamestate}>({});
    const [selectedGame, setSelectedGame] = useState<string | undefined>(undefined);
    const [shownGame, setShownGame] = useState<string | undefined>(undefined);

    useEffect(() => {
        if(socket) {
            socket.emit('getGames');

            socket.on('games', (games: {[id: string]: Gamestate}) => {
                console.log("Received games:", games);
                
                setGameObj(games);
                const gameTabs = buildGameTabs(games);
                // const gameTabs = Object.keys(games).map((id) => (
                //     <div data-tab={id} key={id} className={styles.gameTab}>
                //         <VideocamIcon className={styles.videoIcon} onClick={() => {
                //             socket?.emit('showGame', id);
                //         }}/>
                //         {`${games[id].playerOne.name} vs ${games[id].playerTwo.name}`}
                //         <ClearIcon className="close-icon" onClick={() => {
                //             socket?.emit('removeGame', id);
                //             console.log(`Removing game: ${id}`);
                            
                //             setSelectedGame(undefined);
                //         }} />
                //     </div>
                // ));
                setGames(gameTabs);
                console.log(selectedGame);
                
                if(selectedGame === undefined && gameTabs.length > 0) {
                    setSelectedGame(gameTabs[gameTabs.length-1].props['data-tab']);
                }
            });

            socket.on('shownGame', (gameId: string) => {
                console.log(`Showing game: ${gameId}`);
                
                setShownGame(gameId);
                // console.log(`Setting shown game to: ${shownGame}`);
                
                // const gameTabs = buildGameTabs(gameObj);
                // setGames(gameTabs);
            });
        }

        return () => {
            socket?.off('games');
            socket?.off('shownGame');
        };
    }, [socket]);

    useEffect(() => {
        if (shownGame) {
            console.log(`Effect: shownGame changed to ${shownGame}`);
            const gameTabs = buildGameTabs(gameObj);
            setGames(gameTabs);
        }
    }, [shownGame]);

    function handleTabChange(index: number, child: React.ReactNode) {
        console.log(`Tab changed to index: ${index}`, child);
        
        if(!child || typeof child !== 'object' || !('props' in child)) {
            console.error("Invalid child node:", child);
            return;
        }
        //@ts-expect-error asd
        const tabName = (child).props['data-tab'];
        if (tabName === 'add') {
            setSelectedGame(undefined);
        } else {
            setSelectedGame(tabName);
        }
    }

    function buildGameTabs(games: {[id: string]: Gamestate}) {
        return Object.keys(games).map((id) => (
            <div data-tab={id} key={id} className={styles.gameTab}>
                {(shownGame === id) ? (
                    <VideocamIcon className={styles.videoIcon} onClick={() => {socket?.emit('showGame', id);}}/>
                ):(
                    <VideocamOffIcon className={styles.videoIcon} onClick={() => {socket?.emit('showGame', id);}}/>
                )}
                {`${games[id].playerOne.name} vs ${games[id].playerTwo.name}`}
                <ClearIcon className="close-icon" onClick={() => {
                    socket?.emit('removeGame', id);
                    console.log(`Removing game: ${id}`);
                    
                    setSelectedGame(undefined);
                }} />
            </div>
        ));
    }

    return (
        <>
            <Tabs callback={handleTabChange} options={[...games, (<div data-tab="add" key={999}>+</div>)]} />
            <GameControls game={gameObj[selectedGame as string]} gameId={selectedGame} />
        </>
    )
}