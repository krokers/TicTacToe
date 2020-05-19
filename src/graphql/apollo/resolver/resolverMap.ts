import {IResolvers} from 'graphql-tools';
import {Game, GAME_UPDATED_TOPIC, GameConfigInput, GameTypes, SetReadyInput} from "../../resolvers/resolvers";
import {HttpError} from "../../../utils/HttpError";
import {keysAsString} from "../../../utils/TextUtils";
import {IGameService} from "../../../services/game/IGameService";
import {injectable, inject} from "inversify";
import {TYPES} from "../../../di/types";
import { PubSub } from 'apollo-server-express';
import {ILogger} from "../../../utils/logger/ILogger";
import {IInputValidators} from "../../../services/validators/IInputValidators";

const PLAYER_READY = 'PLAYER_READY';

@injectable()
class GameResolvers {
    pubsub:PubSub;

    constructor(@inject(TYPES.GameService) private gameService: IGameService,
                @inject(TYPES.Logger) private log: ILogger,
                @inject(TYPES.InputValidators) private inputValidators: IInputValidators) {
        this.pubsub = new PubSub(); // TODO Inject
    }

    getResolvers() {

        const resolverMap: IResolvers = {
            Query: {
                helloWorld: (_: void, args: void): string =>{
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
                    this.log.v(`About to publish subscription event. pubsub: ${this.pubsub}`)
                    await this.pubsub.publish(PLAYER_READY, { playerReady: "test" });
                    return Promise.resolve(Game.from(gameData));
                },
                setReady: async (parent: any, {setReady}: { setReady: SetReadyInput }) => {
                    this.inputValidators.validatePlayer(setReady.player);
                    this.log.v("Setting player %s ready for game %s", setReady.player, setReady.gameId);
                    const gameData = await this.gameService.setPlayerReady(setReady.gameId, setReady.player);
                    const game = Game.from(gameData);
                    await this.pubsub.publish(GAME_UPDATED_TOPIC, {gameUpdated: game})
                    return game;
                }

            },
            Subscription: {
                playerReady: {
                    subscribe: () => this.pubsub.asyncIterator([PLAYER_READY]),
                }
            }
        };

        return resolverMap;
    }
}

export default GameResolvers;
