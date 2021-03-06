import {GameData} from "../../data/game/IGameRepository";
import {PlayerTypes} from "../../graphql/apollo/data/data";

export interface IGameService {
    createGame(gameType: string):Promise<GameData>;
    getGame(gameId: string):Promise<GameData>
    setPlayerReady(gameId: string, player:PlayerTypes):Promise<GameData>;
    getGames(): Promise<GameData[]>;
    tryMarkPosition(gameId: string, player:PlayerTypes, position: number):Promise<GameData>;
    makeComputerMoveIfApplicable(game:GameData): Promise<GameData>
}