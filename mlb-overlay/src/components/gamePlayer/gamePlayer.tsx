import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from "@mui/material/Tooltip";
import { useContext, useEffect, useState, type ChangeEvent } from 'react';
import type { Player } from "../../interfaces";
import { socketCtx } from '../socketIOCtx/socketIOCtx';
import VDOFrame from "../vdoFrame/vdoFrame";
import styles from "./gamePlayer.module.css";

export function GamePlayer({player, focused, speakingTo, gameId, playerId}: { player: Player, focused: boolean, speakingTo: boolean, gameId: string | undefined, playerId: number}) {
    const socket = useContext(socketCtx);
    const [total, setTotal] = useState(player.mlbTotal || 0);
    const [record, setRecord] = useState(player.mlbRecord || 0);

    useEffect(() => {
        if (player.mlbTotal !== undefined && player.mlbTotal >= 0 && player.mlbTotal !== total) {
            setTotal(player.mlbTotal);
        }
        if (player.mlbRecord !== undefined && player.mlbRecord !== record) {
            setRecord(player.mlbRecord);
        }
    }, [player.mlbTotal, player.mlbRecord]);

    function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newVolume = parseInt(event.target.value, 10);
        socket?.emit('setGameVolume', player.name, newVolume / 100);
    }

    function handleFocus() {
        if (socket && gameId) {
            socket.emit('tFocusPlayer', gameId, playerId);
        }
    }

    function handleSpeak() {
        if (socket && gameId) {
            socket.emit('tSpeakToPlayer', gameId, playerId);
        }
    }

    function handleMLB() {
        if (socket) {
            socket.emit('setMLB', player.name, total, record);
        }
    }

    function resetPlayer() {
        if (socket && gameId) {
            socket.emit('resetPlayer', gameId, playerId);
        }
    }

    function increaseLives() {
        if (socket && gameId) {
            socket.emit('updatePlayerLives', gameId, playerId, player.lives + 1);
        }
    }

    function decreaseLives() {
        if (socket && gameId) {
            socket.emit('updatePlayerLives', gameId, playerId, player.lives - 1);
        }
    }

    function increasePoints() {
        if (socket && gameId) {
            socket.emit('updatePlayerPoints', gameId, playerId, player.points + 1);
        }
    }

    function decreasePoints() {
        if (socket && gameId) {
            socket.emit('updatePlayerPoints', gameId, playerId, player.points - 1);
        }
    }

    function increaseSpent() {
        if (socket && gameId) {
            socket.emit('updatePlayerSpent', gameId, playerId, player.totalSpent + 1);
        }
    }

    function decreaseSpent() {
        if (socket && gameId) {
            socket.emit('updatePlayerSpent', gameId, playerId, player.totalSpent - 1);
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                {player.name}
            </div>
            <div className={styles.cam}>
                <VDOFrame code={player.vdoCode} volume={0} />
            </div>
            <div className={styles.buttons}>
                <Tooltip title="focus player">
                    <div className={styles.btn} onClick={handleFocus}>
                        {focused ? <MyLocationIcon /> : <LocationSearchingIcon />}
                    </div>
                </Tooltip>
                <Tooltip title="speak to player">
                    <div className={styles.btn} onClick={handleSpeak}>
                        {speakingTo ? <RecordVoiceOverIcon /> : <VoiceOverOffIcon />}
                    </div>
                </Tooltip>
                <Tooltip title="mute player">
                    <div className={styles.btn}>
                        {player.muted ? <MicOffIcon /> : <MicIcon />}
                    </div>
                </Tooltip>
                <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1, width: '15em'}}>
                    <VolumeDownIcon />
                    <Slider aria-label="Volume" value={player.volume*100} defaultValue={player.volume} onChange={(e) => {handleVolumeChange(e as unknown as ChangeEvent<HTMLInputElement>)}} />
                    <VolumeUpIcon />
                </Stack>
                <div className={styles.btn} onClick={resetPlayer}>Reset</div>
            </div>
            <div className={styles.inputs}>
                <TextField
                    id="mlb-total"
                    label="MLB Total Pts"
                    value={total}
                    variant="outlined"
                    onChange={(e) => setTotal(parseInt(e.target.value,10))}
                />
                <TextField
                    id="mlb-record"
                    label="MLB Record Pts"
                    value={record}
                    variant="outlined"
                    onChange={(e) => setRecord(e.target.value)}
                />
                <div className={styles.btn} onClick={handleMLB}>
                    Update
                </div>
            </div>
            <div className={styles.stats}>
                <div className={styles.stat}>
                    {(player.lives > 0) ? <div className={styles.tButton} onClick={decreaseLives}>-</div> : <span>-</span>}
                    <FavoriteIcon />
                    {player.lives || 4}
                    {(player.lives < 4) ? <div className={styles.tButton} onClick={increaseLives}>+</div> : <span>+</span>}
                </div>
                <div className={styles.stat}>
                    {(player.points > 0) ? <div className={styles.tButton} onClick={decreasePoints}>-</div> : <span>-</span>}
                    <SportsScoreIcon />
                    {player.points || 0}
                    {(player.points < 2) ? <div className={styles.tButton} onClick={increasePoints}>+</div> : <span>+</span>}
                </div>
                <div className={styles.stat}>
                    {(player.totalSpent > 0) ? <div className={styles.tButton} onClick={decreaseSpent}>-</div> : <span>-</span>}
                    <AttachMoneyIcon />
                    {player.totalSpent || 0}
                    <div className={styles.tButton} onClick={increaseSpent}>+</div>
                </div>
                <div className={styles.stat}>
                    round: {player.roundNum || 1}
                </div>
            </div>
        </div>
    );
}