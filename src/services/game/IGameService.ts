import {GameData, IGameRepository} from "../../data/game/IGameRepository";

export interface IGameService {
    createGame(gameType: string):Promise<GameData>;

    getGames(): Promise<GameData[]>;
}