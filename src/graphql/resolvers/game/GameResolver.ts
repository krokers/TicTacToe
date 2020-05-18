import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Game, GameConfigInput, GameTypes, IGraphqlResolver, SetReadyInput} from "../resolvers";
import {HttpError} from "../../../utils/HttpError";
import {TYPES} from "../../../di/types";
import {ILogger} from "../../../utils/logger/ILogger";
import {IGameService} from "../../../services/game/IGameService";

@injectable()
class GraphqlResolver implements IGraphqlResolver {

    constructor(@inject(TYPES.GameService) private gameService: IGameService,
                @inject(TYPES.Logger) private log: ILogger) {
    }

    async createGame({config}: {config:GameConfigInput}, request: any): Promise<Game> {
        this.log.v("Creating new game.")
        if (!(config.gameType === GameTypes.SINGLE_PLAYER || config.gameType === GameTypes.MULTI_PLAYER)) {
            throw new HttpError(`Unknown game type. Allowed types are ${GameTypes.SINGLE_PLAYER} 
            or ${GameTypes.MULTI_PLAYER}`, 422);
        }

        const gameData = await this.gameService.createGame(config.gameType);
        return Game.from(gameData);
    }

    setReady({setReady}: {setReady:SetReadyInput}, request: any): Promise<Game> {
        this.log.v("Setting player %s ready for game %s", setReady.player, setReady.gameId);
        return this.gameService.setPlayerReady(setReady.gameId, setReady.player);
    }

    hello(): string {
        return 'Hi!'
    }

    async getGames(): Promise<Game[]> {
        return (await this.gameService.getGames()).map(Game.from)
    }
}

export default GraphqlResolver;