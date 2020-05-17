import { injectable, inject } from "inversify";
import "reflect-metadata";
import {GameData, IGameRepository} from "../../data/game/IGameRepository";
import {IGameService} from "./IGameService";
import {TYPES} from "../../di/types";

@injectable()
export class GameService implements IGameService{
    constructor(@inject(TYPES.GameRepository) private gameRepository: IGameRepository) {}

    createGame(gameType: string):Promise<GameData> {
        return this.gameRepository.create(gameType);
    }

    getGames(): Promise<GameData[]>{
        return this.gameRepository.findAll();
    }
}