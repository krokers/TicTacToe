import {IResolvers} from 'graphql-tools';
import {HttpError} from "../../../utils/HttpError";
import {keysAsString} from "../../../utils/TextUtils";
import {IGameService} from "../../../services/game/IGameService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../di/types";
import {ILogger} from "../../../utils/logger/ILogger";
import {IInputValidators} from "../../../services/validators/IInputValidators";
import {Game, GameConfigInput, GameStatus, GameTypes, MoveInput, SetReadyInput,} from "../data/data";
import {ISubscriptionsService} from "../../../services/subscriptions/ISubscriptionService";

@injectable()
class GameResolvers {

    constructor(@inject(TYPES.GameService) private gameService: IGameService,
                @inject(TYPES.Logger) private log: ILogger,
                @inject(TYPES.InputValidators) private inputValidators: IInputValidators,
                @inject(TYPES.SubscriptionsService) private subscriptionsService: ISubscriptionsService) {
    }

    getResolvers() {

        const resolverMap: IResolvers = {
            Query: {
                helloWorld: (_: void, args: void): string => {
                    return `Hello world!` + this.gameService;
                },
                getGame: async (_: void, {gameId}: { gameId: string }) => {
                    const game = await this.gameService.getGame(gameId);
                    // this.log.v()
                    console.log("Retrieving game:", game);
                    return Game.from(game);
                }
            },
            Mutation: {
                createGame: async (parent: any, {config}: { config: GameConfigInput }) => {
                    if (!Object.values(GameTypes).includes(config.gameType)) {
                        throw new HttpError(`Unknown game type. Allowed types
                 are ${keysAsString(GameTypes, ', ')}`, 422);
                    }

                    let gameData = await this.gameService.createGame(config.gameType);
                    gameData = await this.gameService.makeComputerMoveIfApplicable(gameData)
                    return Promise.resolve(Game.from(gameData));
                },

                setReady: async (parent: any, {setReady}: { setReady: SetReadyInput }) => {
                    this.inputValidators.validatePlayer(setReady.player);
                    this.log.v("Setting player %s ready for game %s", setReady.player, setReady.gameId);
                    const gameData = await this.gameService.setPlayerReady(setReady.gameId, setReady.player);
                    const game = Game.from(gameData);
                    await this.subscriptionsService.gameStatusChanged(game, GameStatus.PLAYER_READY)
                    return game;
                },

                makeMove: async (parent: any, {move}: { move: MoveInput }, request: any): Promise<Game> => {
                    this.inputValidators.validatePlayer(move.player);
                    this.inputValidators.validatePosition(move.position);
                    this.log.v(`Making move. Player: ${move.player} position: ${move.position} gameId: ${move.gameId}`)
                    let updatedGame = await this.gameService.tryMarkPosition(move.gameId, move.player, move.position);

                    await this.subscriptionsService.gameStatusChanged(updatedGame, GameStatus.PLAYER_MOVE);
                    if (updatedGame.ended) {
                        await this.subscriptionsService.gameStatusChanged(updatedGame, GameStatus.GAME_OVER);
                        return Promise.resolve(Game.from(updatedGame));
                    }

                    if (updatedGame.gameType === GameTypes.SINGLE_PLAYER) {
                        updatedGame = await this.gameService.makeComputerMoveIfApplicable(updatedGame);
                        await this.subscriptionsService.gameStatusChanged(updatedGame, GameStatus.PLAYER_MOVE);

                        if (updatedGame.ended) {
                            await this.subscriptionsService.gameStatusChanged(updatedGame, GameStatus.GAME_OVER);
                            return Promise.resolve(Game.from(updatedGame));
                        }
                    }

                    return Promise.resolve(Game.from(updatedGame));
                }

            },
            Subscription: {
                gameStatusChanged: {
                    subscribe: this.subscriptionsService.subscribe(),
                }
            }
        };

        return resolverMap;
    }
}

export default GameResolvers;
