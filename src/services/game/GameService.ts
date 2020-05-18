import {inject, injectable} from "inversify";
import "reflect-metadata";
import {GameData, IGameRepository} from "../../data/game/IGameRepository";
import {IGameService} from "./IGameService";
import {TYPES} from "../../di/types";
import {HttpError} from "../../utils/HttpError";
import {PlayerTypes} from "../../graphql/resolvers/resolvers";
import {ActionType, IHistoryRepository} from "../../data/history/IHistoryRepository";

@injectable()
export class GameService implements IGameService{
    constructor(@inject(TYPES.GameRepository) private gameRepository: IGameRepository,
                @inject(TYPES.HistoryRepository) private historyRepository: IHistoryRepository) {}

    async createGame(gameType: string): Promise<GameData> {
        const game = await this.gameRepository.create(gameType);
        this.historyRepository.addEntry(ActionType.GameCreated, game._id, "New Game Created");
        return game;
    }

    async setPlayerReady(gameId: string, player: PlayerTypes): Promise<GameData> {
        const game = await this.gameRepository.findById(gameId);
        if (!game) {
            throw new HttpError(`Game with id '${gameId}' not found!`, 404)
        }

        switch (player) {
            case PlayerTypes.PLAYER_O:
                game.playerOReady = true;
                break;
            case PlayerTypes.PLAYER_X:
                game.playerXReady = true;
                break;
        }
        const updatedGame = await this.gameRepository.update(game);
        this.historyRepository.addEntry(ActionType.PlayerSetReady, gameId, `Player ${player} is ready `, player);
        return updatedGame;
    }

    getGames(): Promise<GameData[]>{
        return this.gameRepository.findAll();
    }
}