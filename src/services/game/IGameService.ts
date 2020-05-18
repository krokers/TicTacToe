import {GameData} from "../../data/game/IGameRepository";
import {PlayerTypes} from "../../graphql/resolvers/resolvers";

export interface IGameService {
    createGame(gameType: string):Promise<GameData>;
    setPlayerReady(gameId: string, player:PlayerTypes):Promise<GameData>;
    getGames(): Promise<GameData[]>;
    makeMove(gameId: string, player:PlayerTypes, position: number):Promise<GameData>;
}