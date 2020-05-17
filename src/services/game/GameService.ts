import {GameData, IGameRepository} from "../../data/game/IGameRepository";
import {IGameService} from "./IGameService";

export class GameService implements IGameService{
    constructor(private gameRepository: IGameRepository) {}

    createGame(gameType: string):Promise<GameData> {
        return this.gameRepository.create(gameType);
    }

    getGames(): Promise<GameData[]>{
        return this.gameRepository.findAll();
    }
}