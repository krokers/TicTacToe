import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Game, GameConfigInput, IGraphqlResolver, SetReadyInput} from "../resolvers";
import {GameService} from "../../../services/game/GameService";
import {HttpError} from "../../../utils/HttpError";
import {GameTypes} from "../../../data/game/IGameRepository";
import {TYPES} from "../../../di/types";
import SINGLE_PLAYER = GameTypes.SINGLE_PLAYER;
import MULTI_PLAYER = GameTypes.MULTI_PLAYER;

@injectable()
class GraphqlResolver implements IGraphqlResolver {

    constructor(@inject(TYPES.GameService) private gameService: GameService) {
    }

    async createGame({config}: {config:GameConfigInput}, request: any): Promise<Game> {

        if (!(config.gameType === SINGLE_PLAYER || config.gameType === MULTI_PLAYER)) {
            throw new HttpError(`Unknown game type. Allowed types are ${SINGLE_PLAYER} or ${MULTI_PLAYER}`, 422);
        }

        const gameData = await this.gameService.createGame(config.gameType);
        return Game.from(gameData);
    }

    setReady({setReady}: {setReady:SetReadyInput}, request: any): Promise<Game> {
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