import {IResolvers} from 'graphql-tools';
import {Game, GameConfigInput, GameTypes} from "../../resolvers/resolvers";
import {HttpError} from "../../../utils/HttpError";
import {keysAsString} from "../../../utils/TextUtils";
import {IGameService} from "../../../services/game/IGameService";
import {injectable, inject} from "inversify";
import {TYPES} from "../../../di/types";
import { PubSub } from 'apollo-server-express';
import {ILogger} from "../../../utils/logger/ILogger";

const PLAYER_READY = 'PLAYER_READY';

@injectable()
class GameResolvers {
    pubsub:PubSub;

    constructor(@inject(TYPES.GameService) private gameService: IGameService,
                @inject(TYPES.Logger) private log: ILogger) {
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
