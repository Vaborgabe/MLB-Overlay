export interface Player {
    name: string;
    vdoCode: string;
    volume: number;
    muted: boolean;
    lives: number;
    points: number;
    roundNum: number;
    prevHighScore: number;
    totalSpent: number;
    mlbTotal: number;
    mlbRecord: string;
    vouchers: string[];
}

export interface Gamestate {
    ante: number;
    time: string;
    focus: number;
    playerOne: Player;
    playerTwo: Player;
    speakingTo: number;
}