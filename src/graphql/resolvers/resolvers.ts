import {GameData} from "../../data/game/IGameRepository";

export enum GameTypes {
    SINGLE_PLAYER = 'singleplayer',
    MULTI_PLAYER = 'multiplayer',
}

export interface GameConfigInput {
    gameType: GameTypes;
}

export interface SetReadyInput {
    gameId: string;
    player: string; //"X", "O"
}

export class Game {

    constructor(public _id: string, public gameType: string) {
    }

    static from(gameData: GameData): Game {
        return new Game(gameData._id, gameData.gameType);
    }
}

export interface IGraphqlResolver {
    createGame: ({config}:{config:GameConfigInput}, request: any) => Promise<Game>;
    setReady: ({setReady}:{setReady:SetReadyInput}, request: any) => Promise<Game>;

    hello: () => string;
    getGames(): Promise<Game[]>;
}