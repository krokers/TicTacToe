import {GameData} from "../../data/game/IGameRepository";

export interface IGameService {
    createGame(gameType: string):Promise<GameData>;
    setPlayerReady(gameId: string, player:string):Promise<GameData>;
    getGames(): Promise<GameData[]>;
}