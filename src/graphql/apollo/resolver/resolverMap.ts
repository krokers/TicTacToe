import {IResolvers} from 'graphql-tools';
import {Game, GameConfigInput, GameTypes} from "../../resolvers/resolvers";
import {HttpError} from "../../../utils/HttpError";
import {keysAsString} from "../../../utils/TextUtils";
import {IGameService} from "../../../services/game/IGameService";
import {injectable, inject} from "inversify";
import {TYPES} from "../../../di/types";

@injectable()
class GameResolvers {

    constructor(@inject(TYPES.GameService) private gameService: IGameService) {
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
                    return Promise.resolve(Game.from(gameData));
                }
            }
        };

        return resolverMap;
    }
}

export default GameResolvers;
