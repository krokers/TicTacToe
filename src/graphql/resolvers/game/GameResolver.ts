import {Game, GameConfigInput, IGraphqlResolver} from "../resolvers";
import {GameService} from "../../../services/game/GameService";
import {HttpError} from "../../../utils/HttpError";
import {GameTypes} from "../../../data/game/IGameRepository";
import SINGLE_PLAYER = GameTypes.SINGLE_PLAYER;
import MULTI_PLAYER = GameTypes.MULTI_PLAYER;

class GraphqlResolver implements IGraphqlResolver {


    constructor(private gameService: GameService) {
    }

    async createGame(gameConfig: GameConfigInput, request: any): Promise<Game> {
        console.log("Creating new game: ", gameConfig);

        if (!(gameConfig.gameType === SINGLE_PLAYER || gameConfig.gameType === MULTI_PLAYER)) {
            throw new HttpError(`Unknown game type. Allowed types are ${SINGLE_PLAYER} or ${MULTI_PLAYER}`, 422);
        }

        const gameData = await this.gameService.createGame(gameConfig.gameType);
        console.log("Created game: ", gameData);
        return Game.from(gameData);
    }

    hello(): string {
        return 'Hi!'
    }

    async getGames(): Promise<Game[]> {
        return (await this.gameService.getGames()).map(Game.from)
    }
}

export default GraphqlResolver;