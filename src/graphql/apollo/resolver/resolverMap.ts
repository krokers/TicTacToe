import {IResolvers} from 'graphql-tools';
import {HttpError} from "../../../utils/HttpError";
import {keysAsString} from "../../../utils/TextUtils";
import {IGameService} from "../../../services/game/IGameService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../di/types";
import {PubSub, withFilter} from 'apollo-server-express';
import {ILogger} from "../../../utils/logger/ILogger";
import {IInputValidators} from "../../../services/validators/IInputValidators";
import {
    Game,
    GameConfigInput,
    GameStatus,
    GameStatusChange, GameStatusChangePayload,
    GameTypes,
    MoveInput,
    SetReadyInput,
    SUBSCRIPTION_GAME_STATUS_CHANGED,
} from "../data/data";

@injectable()
class GameResolvers {
    pubsub: PubSub;

    constructor(@inject(TYPES.GameService) private gameService: IGameService,
                @inject(TYPES.Logger) private log: ILogger,
                @inject(TYPES.InputValidators) private inputValidators: IInputValidators) {
        this.pubsub = new PubSub(); // TODO Inject
    }

    getResolvers() {

        const resolverMap: IResolvers = {
            Query: {
                helloWorld: (_: void, args: void): string => {
                    return `Hello world!` + this.gameService;
                },
            },
            Mutation: {
                createGame: async (parent: any, {config}: { config: GameConfigInput }) => {
                    if (!Object.values(GameTypes).includes(config.gameType)) {
                        throw new HttpError(`Unknown game type. Allowed types
                 are ${keysAsString(GameTypes, ', ')}`, 422);
                    }

                    const gameData = await this.gameService.createGame(config.gameType);
                    return Promise.resolve(Game.from(gameData));
                },

                setReady: async (parent: any, {setReady}: { setReady: SetReadyInput }) => {
                    this.inputValidators.validatePlayer(setReady.player);
                    this.log.v("Setting player %s ready for game %s", setReady.player, setReady.gameId);
                    const gameData = await this.gameService.setPlayerReady(setReady.gameId, setReady.player);
                    const game = Game.from(gameData);
                    await this.pubsub.publish(SUBSCRIPTION_GAME_STATUS_CHANGED, new GameStatusChangePayload( new GameStatusChange(game, GameStatus.PLAYER_READY)));
                    return game;
                },

                makeMove: async (parent: any, {move}: { move: MoveInput }, request: any): Promise<Game> => {
                    this.inputValidators.validatePlayer(move.player);
                    this.inputValidators.validatePosition(move.position);
                    this.log.v(`Making move. Player: ${move.player} position: ${move.position} gameId: ${move.gameId}`)
                    //todo: add subscription!
                    return this.gameService.makeMove(move.gameId, move.player, move.position);
                }

            },
            Subscription: {
                gameStatusChanged: {
                    subscribe: withFilter(
                        (gameId: string) => this.pubsub.asyncIterator([SUBSCRIPTION_GAME_STATUS_CHANGED]),
                        (payload: GameStatusChangePayload, {gameId}: { gameId: string }) => payload.gameStatusChanged.game._id === gameId
                    )
                }
            }
        };

        return resolverMap;
    }
}

export default GameResolvers;
