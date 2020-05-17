import {GameData} from "../../data/game/IGameRepository";

export interface GameConfigInput {
    gameType: string;
}

export class Game {

    constructor(public _id: string, public gameType: string) {
    }

    static from(gameData: GameData): Game {
        return new Game(gameData._id, gameData.gameType);
    }
}

export interface IGraphqlResolver {
    createGame: (gameConfig: GameConfigInput, request: any) => Promise<Game>;
    hello: () => string;

    getGames(): Promise<Game[]>;
}