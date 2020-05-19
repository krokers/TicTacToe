import {inject, injectable} from "inversify";
import "reflect-metadata";
import {GameData, IGameRepository} from "../../data/game/IGameRepository";
import {IGameService} from "./IGameService";
import {TYPES} from "../../di/types";
import {HttpError} from "../../utils/HttpError";
import {PlayerTypes} from "../../graphql/resolvers/resolvers";
import {ActionType, IHistoryRepository} from "../../data/history/IHistoryRepository";
import {ILogger} from "../../utils/logger/ILogger";

@injectable()
export class GameService implements IGameService {
    constructor(@inject(TYPES.GameRepository) private gameRepository: IGameRepository,
                @inject(TYPES.HistoryRepository) private historyRepository: IHistoryRepository,
                @inject(TYPES.Logger) private log: ILogger) {
    }

    async createGame(gameType: string): Promise<GameData> {
        const game = await this.gameRepository.create(gameType);
        this.log.v(`Creating new ${gameType} game.`);
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
        if (game.playerOReady && game.playerXReady) {
            game.nextPlayer = Math.random() > 0.5 ? PlayerTypes.PLAYER_O : PlayerTypes.PLAYER_X;
            const message = `Player ${game.nextPlayer} is picked as first player`;
            this.log.v(message);
            this.historyRepository.addEntry(ActionType.SelectedFirstPlayer, gameId, message);
        }
        const updatedGame = await this.gameRepository.update(game);
        this.historyRepository.addEntry(ActionType.PlayerSetReady, gameId, `Player ${player} is ready `, player);
        return updatedGame;
    }

    getGames(): Promise<GameData[]> {
        return this.gameRepository.findAll();
    }

    async makeMove(gameId: string, player: PlayerTypes, position: number): Promise<GameData> {
        const repoGame = await this.gameRepository.findById(gameId)
        if (!repoGame) {
            throw new HttpError(`Game with id '${gameId}' not found!`, 404)
        }
        const game = {
            ...repoGame};

        if (!(game.playerXReady && game.playerOReady)) {
            throw  new HttpError("Both players must be ready to make a move!", 412);
        }
        if (game.nextPlayer !== player) {
            throw  new HttpError("Not your turn!", 412);
        }
        if (game.selections[position] !== PlayerTypes.PLAYER_NONE) {
            throw  new HttpError(`Position ${position} is already taken!`, 412);
        }
        const nextPlayer = player === PlayerTypes.PLAYER_X ? PlayerTypes.PLAYER_O : PlayerTypes.PLAYER_X;
        game.selections[position] = player;
        game.nextPlayer = nextPlayer;

        const winner: PlayerTypes = this.checkWinner(game)
        if (winner !== PlayerTypes.PLAYER_NONE) {
            game.ended = true;
            game.winner = winner;
            const message = `Player ${winner} won!`
            this.log.v(message);
            this.historyRepository.addEntry(ActionType.SelectedFirstPlayer, game._id, message, winner );
        }

        //TODO: check game over (all fields selected)

        const updatedGame = await this.gameRepository.update(game);
        this.historyRepository.addEntry(ActionType.PlayerMove, updatedGame._id,
            `Player ${player} made a check on position ${position}`, gameId, player, "" + position)
        return Promise.resolve(updatedGame);
    }

    /**
     * Return {PlayerTypes#PLAYER_NONE} if there is no winner, or winning player.
     * @param game
     */
    private checkWinner(game: GameData): PlayerTypes {
        this.log.v("Checking for winner: ", game.selections);
        const winner = Object.values(PlayerTypes)
            .filter(p => p !== PlayerTypes.PLAYER_NONE)
            .reduce( (currentWinner, player) => {
                const p = player.toString();
                if (
                    (game.selections[0] === p && game.selections[1] === p && game.selections[2] === p) ||
                    (game.selections[3] === p && game.selections[4] === p && game.selections[5] === p) ||
                    (game.selections[6] === p && game.selections[7] === p && game.selections[8] === p) ||
                    (game.selections[0] === p && game.selections[3] === p && game.selections[6] === p) ||
                    (game.selections[1] === p && game.selections[4] === p && game.selections[7] === p) ||
                    (game.selections[2] === p && game.selections[5] === p && game.selections[8] === p) ||
                    (game.selections[0] === p && game.selections[4] === p && game.selections[8] === p) ||
                    (game.selections[2] === p && game.selections[4] === p && game.selections[6] === p)
                ) {
                    return player;
                }
                return PlayerTypes.PLAYER_NONE;
            }, PlayerTypes.PLAYER_NONE)
        return winner;
    }
}