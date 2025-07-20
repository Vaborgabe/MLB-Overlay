import React from "react";
import HostRive from "../rive/host/hostRive";
import BackgroundShader from "../shaders/background/backgroundShader";
import styles from "./hostLayout.module.css";

const gameData = {
    ante: 2,
    time: "1:22:45",
    focus: 0,
    hosts: [
        'https://vdo.ninja/?view=asdASDDHK7j&bitrate=10000&scale=100',
    ],
    playerOne: {
        name: "nandre",
        link: 'https://vdo.ninja/?view=Md7G9Zj&bitrate=10000&scale=100',
        lives: 3,
        points: 1,
        roundNum: 1,
        prevHighScore: "100",
        totalSpent: "$50",
        mlbTotal: "1000",
        mlbRecord: "10-5",
        vouchers: ["overstock"]
    },
    playerTwo: {
        name: "Zaino",
        link: 'https://vdo.ninja/?view=SKJDHK7j&bitrate=10000&scale=100',
        lives: 2,
        points: 0,
        roundNum: 2,
        prevHighScore: "150",
        totalSpent: "$53",
        mlbTotal: "1200",
        mlbRecord: "6-5",
        vouchers: ["hone", "glowUp"]
    }
}

class stopWatch {
    startTime: number;
    elapsedTime: number;

    constructor() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
    }

    reset() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
    }

    getElapsedTime() {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        //convert to H:MM:SS format
        const s = Math.floor(this.elapsedTime % 60);
        const m = Math.floor((this.elapsedTime / 60) % 60);
        const h = Math.floor(this.elapsedTime / 3600);
        return `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }
}

const HostLayout = () => {
    const [gameDataState, setGameDataState] = React.useState(gameData);

    const stopwatch = new stopWatch();
    React.useEffect(() => {
        const interval = setInterval(() => {
            const time = stopwatch.getElapsedTime();
            const newGameData = { ...gameDataState };
            newGameData.time = time;
            newGameData.focus = Math.floor(stopwatch.elapsedTime/10);
            setGameDataState(newGameData);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        
        <div className={styles.wrapper} >
            <HostRive GameData={gameDataState}/>
            <BackgroundShader />
        </div>
        
    )
}

export default HostLayout;