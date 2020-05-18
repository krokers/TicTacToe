import { injectable, inject } from "inversify";
import "reflect-metadata";
import {GameData, IGameRepository} from "../../data/game/IGameRepository";
import {IGameService} from "./IGameService";
import {TYPES} from "../../di/types";
import {HttpError} from "../../utils/HttpError";
import {PlayerTypes} from "../../graphql/resolvers/resolvers";

@injectable()
export class GameService implements IGameService{
    constructor(@inject(TYPES.GameRepository) private gameRepository: IGameRepository) {}

    createGame(gameType: string):Promise<GameData> {
        return this.gameRepository.create(gameType);
    }

    async setPlayerReady(gameId: string, player: PlayerTypes): Promise<GameData> {
        const game = await this.gameRepository.findById(gameId);
        if (!game) {
            throw new HttpError(`Game with id '${gameId}' not found!`, 404)
        }
        //TODO: validate player and set ready state.
        return game;
    }

    getGames(): Promise<GameData[]>{
        return this.gameRepository.findAll();
    }
}