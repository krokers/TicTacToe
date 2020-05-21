import {inject, injectable} from "inversify";
import "reflect-metadata";
import {GameData, IGameRepository} from "../../data/game/IGameRepository";
import {IGameService} from "./IGameService";
import {TYPES} from "../../di/types";
import {HttpError} from "../../utils/HttpError";
import {ActionType, IHistoryRepository} from "../../data/history/IHistoryRepository";
import {ILogger} from "../../utils/logger/ILogger";
import {GameTypes, PlayerTypes} from "../../graphql/apollo/data/data";
import {IGameOverService} from "./IGameOverService";

@injectable()
export class GameService implements IGameService {
    constructor(@inject(TYPES.GameRepository) private gameRepository: IGameRepository,
                @inject(TYPES.HistoryRepository) private historyRepository: IHistoryRepository,
                @inject(TYPES.Logger) private log: ILogger,
                @inject(TYPES.GameOverService) private gameOverService: IGameOverService) {
    }

    async createGame(gameType: GameTypes): Promise<GameData> {
        const game = await this.gameRepository.create(gameType);
        this.log.v(`Creating new ${gameType} game.`);
        this.historyRepository.addEntry(ActionType.GameCreated, game._id, "New Game Created");

        let updatedGame = game;
        if (gameType === GameTypes.SINGLE_PLAYER) {
            game.playerXReady = true;
            game.playerOReady = true;
            game.nextPlayer = Math.random() > 0.5 ? PlayerTypes.PLAYER_O : PlayerTypes.PLAYER_X;
            updatedGame = await this.gameRepository.update(updatedGame);
        }
        return updatedGame;
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
        this.historyRepository.addEntry(ActionType.PlayerSetReady, gameId, `Player ${player} is ready `);
        return updatedGame;
    }

    getGames(): Promise<GameData[]> {
        return this.gameRepository.findAll();
    }

    async tryMarkPosition(gameId: string, player: PlayerTypes, position: number): Promise<GameData> {
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

        if (game.ended) {
            throw new HttpError('This game is already finished', 412);
        }

        let updatedGame = this.markPosition(game, player, position)

        updatedGame = this.gameOverService.checkGameEnded(updatedGame);

        const persistedGame = await this.gameRepository.update(updatedGame);
        this.historyRepository.addEntry(ActionType.PlayerMove, persistedGame._id,
            `Player ${player} made a check on position ${position} in game ${gameId}`)
        return Promise.resolve(persistedGame);
    }

    private markPosition(game: GameData, player: PlayerTypes, position: number): GameData {
        const updatedGame = {...game};
        const nextPlayer = player === PlayerTypes.PLAYER_X ? PlayerTypes.PLAYER_O : PlayerTypes.PLAYER_X;
        updatedGame.selections[position] = player;
        updatedGame.nextPlayer = nextPlayer;
        this.log.v(`Player ${player} selects position ${position}. Next player: ${nextPlayer}` );

        return updatedGame;
    }

    public async makeComputerMoveIfApplicable(game: GameData): Promise<GameData> {
        //TODO check if gameover!
        if (game.gameType === GameTypes.SINGLE_PLAYER && game.nextPlayer !== game.host) {
            let position;
            do {
                position = Math.floor(Math.random() * 9);
            } while (game.selections[position] !== PlayerTypes.PLAYER_NONE )

            return this.tryMarkPosition(game._id, game.nextPlayer, position );
        }
        return Promise.resolve(game);
    }

}