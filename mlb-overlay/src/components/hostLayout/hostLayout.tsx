import React, { useEffect } from "react";
import { type Gamestate, type Player } from "../../interfaces";
import HostRive from "../rive/host/hostRive";
import BackgroundShader from "../shaders/background/backgroundShader";
import { socketCtx } from "../socketIOCtx/socketIOCtx";
import styles from "./hostLayout.module.css";

const gameData = {
    ante: 0,
    time: "0:00:00",
    focus: 0,
    hosts: [
        {
            link: 'https://vdo.ninja/?view=hskjfhksjdh&bitrate=10000&scale=100',
            volume: 1
        },
    ],
    playerOne: {
        name: "Player One",
        link: 'https://vdo.ninja/?view=hskjfhksjdh&bitrate=10000&scale=100',
        volume: 1.0,
        lives: 4,
        points: 0,
        roundNum: 0,
        prevHighScore: "0",
        totalSpent: "0",
        mlbTotal: "0",
        mlbRecord: "0",
        vouchers: [] as string[]
    },
    playerTwo: {
        name: "Player Two",
        link: 'https://vdo.ninja/?view=hskjfhksjdh&bitrate=10000&scale=100',
        volume: 1.0,
        lives: 4,
        points: 0,
        roundNum: 0,
        prevHighScore: "0",
        totalSpent: "0",
        mlbTotal: "0",
        mlbRecord: "0",
        vouchers: [] as string[]
    }
}

const HostLayout = () => {
    const socket = React.useContext(socketCtx);
    const [gameDataState, setGameDataState] = React.useState(gameData);
    const [hosts, setHosts] = React.useState<Player[]>([]);
    const [game, setGame] = React.useState<Gamestate | undefined>(undefined);

    useEffect(() => {
        if (socket) {
            socket.emit('getHosts');
            socket.emit('getGame');

            socket.on('hosts', (hosts: Player[]) => {
                console.log("Received hosts:", hosts);
                setHosts(hosts);
                // for(let i = 0; i < (cams?.hostCams.length?? 0); i++) {
                //     const host = hosts[i];
                //     cams?.hostCams[i].setSrc(`https://vdo.ninja/?view=${host.vdoCode}&bitrate=10000&scale=100`);
                //     console.log(`Setting host cam ${i} to: https://vdo.ninja/?view=${host.vdoCode}&bitrate=10000&scale=100`);
                //     cams?.hostCams[i].reload();
                // }
            });
            socket.on('game', (game: Gamestate) => {
                console.log("Received game:", game);
                setGame(game);
            });
        }

        return () => {
            socket?.off('hosts');
            socket?.off('game');
        };
    }, [socket]);

    useEffect(() => {
        updateGameData();
    }, [game, hosts]);

    function updateGameData() {
        if(!game || !hosts) return;
        setGameDataState({
            ante: game.ante,
            time: game.time,
            focus: game.focus,
            hosts: hosts.map((host) => ({
                link: `https://vdo.ninja/?view=${host.vdoCode}&bitrate=10000&scale=100`,
                volume: host.volume
            })),
            playerOne: {
                name: game.playerOne.name,
                link: `https://vdo.ninja/?view=${game.playerOne.vdoCode}&bitrate=10000&scale=100`,
                volume: game.playerOne.volume,
                lives: game.playerOne.lives,
                points: game.playerOne.points,
                roundNum: game.playerOne.roundNum,
                prevHighScore: game.playerOne.prevHighScore+"",
                totalSpent: game.playerOne.totalSpent+"",
                mlbTotal: game.playerOne.mlbTotal+"",
                mlbRecord: game.playerOne.mlbRecord+"",
                vouchers: game.playerOne.vouchers
            },
            playerTwo: {
                name: game.playerTwo.name,
                link: `https://vdo.ninja/?view=${game.playerTwo.vdoCode}&bitrate=10000&scale=100`,
                volume: game.playerTwo.volume,
                lives: game.playerTwo.lives,
                points: game.playerTwo.points,
                roundNum: game.playerTwo.roundNum,
                prevHighScore: game.playerTwo.prevHighScore+"",
                totalSpent: game.playerTwo.totalSpent+"",
                mlbTotal: game.playerTwo.mlbTotal+"",
                mlbRecord: game.playerTwo.mlbRecord+"",
                vouchers: game.playerTwo.vouchers
            }
        });
    }

    // const stopwatch = new stopWatch();
    // React.useEffect(() => {
    //     const interval = setInterval(() => {
    //         const time = stopwatch.getElapsedTime();
    //         const newGameData = { ...gameDataState };
    //         newGameData.time = time;
    //         newGameData.focus = Math.floor(stopwatch.elapsedTime/10);
    //         setGameDataState(newGameData);
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);


    return (
        
        <div className={styles.wrapper} >
            <HostRive GameData={gameDataState}/>
            <BackgroundShader />
        </div>
        
    );
}

export default HostLayout;