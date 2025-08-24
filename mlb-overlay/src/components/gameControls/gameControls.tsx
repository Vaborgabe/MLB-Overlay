import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from "react";
import type { Gamestate, Player } from "../../interfaces";
import { CollapseSection } from '../collapseSection/collapseSection';
import { GamePlayer } from '../gamePlayer/gamePlayer';
import { socketCtx } from '../socketIOCtx/socketIOCtx';
import styles from "./gameControls.module.css";

export function GameControls({game, gameId}: {game: Gamestate | undefined, gameId: string | undefined}) {
    const socket = useContext(socketCtx);
    const [players, setPlayers] = useState<{ label: string, code: string}[]>([{ label: "no players found", code: "none" }]);

    useEffect(() => {
        if (socket) {
            socket.emit('getPlayers');
            socket.on('players', (players: Player[]) => {
                console.log("Received players:", players);
                
                setPlayers(players.map(p => ({ label: p.name, code: p.vdoCode })));
            });
        }
        return () => {
            socket?.off('players');
        };
    }, [socket]);

    function createGame() {
        if (!socket) {
            console.error("Socket is not connected");
            return;
        }
        const player1 = (document.getElementById('gc-player1') as HTMLInputElement).value;
        const player2 = (document.getElementById('gc-player2') as HTMLInputElement).value;
        if (player1 && player2) {
            socket.emit('createGame', player1, player2);
            console.log(`Game created between ${player1} and ${player2}`);
        } else {
            console.error("Both players must be selected");
        }
    }

    function restartGame() {
        if (socket && gameId) {
            socket.emit('restartGame', gameId);
        }
    }

    function startGameTimer() {
        if (socket && gameId) {
            socket.emit('startGameTimer', gameId);
        }
    }

    function stopGameTimer() {
        if (socket && gameId) {
            socket.emit('stopGameTimer', gameId);
        }
    }

    function increaseAnte() {
        if (socket && gameId && game && game.ante) {
            socket.emit('updateAnte', gameId, game.ante + 1);
        }
    }

    function decreaseAnte() {
        if (socket && gameId && game && game.ante && game.ante > 0) {
            socket.emit('updateAnte', gameId, game.ante - 1);
        }
    }

    return (
        <>
            {game ? (
                <>
                    <div className={styles.header}>
                        <div className={styles.button} onClick={restartGame}>Reset</div>
                        <div className={styles.button} onClick={startGameTimer}>Start Clock</div>
                        <div className={styles.button} onClick={stopGameTimer}>Stop Clock</div>
                        <div className={styles.infoGroup}>
                            <div>Ante:</div>
                            {(game.ante > 1) ? <div className={styles.tButton} onClick={decreaseAnte}>-</div>: '-'}
                            <div>{game.ante}</div>
                            <div className={styles.tButton} onClick={increaseAnte}>+</div>
                        </div>
                    </div>
                    <CollapseSection title='Players'>
                        <div className={styles.gpwrapper}>
                            <GamePlayer player={game.playerOne} focused={(game.focus == 1)} speakingTo={(game.speakingTo == 1 || game.speakingTo == 3)} gameId={gameId} playerId={1}/>
                            <GamePlayer player={game.playerTwo} focused={(game.focus == 2)} speakingTo={(game.speakingTo == 2 || game.speakingTo == 3)} gameId={gameId} playerId={2}/>
                        </div>
                    </CollapseSection>
                </>
            ) : (
                <div className={styles.ngWrapper}>
                    <Autocomplete
                        disablePortal
                        options={players}
                        sx={{ width: '15em'}}
                        renderInput={(params) => <TextField {...params} label="Player 1" />}
                        id='gc-player1'
                    />
                    <div>vs.</div> 
                    <Autocomplete
                        disablePortal
                        options={players}
                        sx={{ width: '15em'}}
                        renderInput={(params) => <TextField {...params} label="Player 2" />}
                        id='gc-player2'
                    />
                    <a className={styles.startBtn} onClick={createGame}>Create Game</a>
                </div>
            )}
        </>
    )
}