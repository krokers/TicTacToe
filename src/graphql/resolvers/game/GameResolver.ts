import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Game, GameConfigInput, GameTypes, IGraphqlResolver, MoveInput, PlayerTypes, SetReadyInput} from "../resolvers";
import {HttpError} from "../../../utils/HttpError";
import {TYPES} from "../../../di/types";
import {ILogger} from "../../../utils/logger/ILogger";
import {IGameService} from "../../../services/game/IGameService";
import {keysAsString} from "../../../utils/TextUtils";

@injectable()
class GraphqlResolver implements IGraphqlResolver {

    constructor(@inject(TYPES.GameService) private gameService: IGameService,
                @inject(TYPES.Logger) private log: ILogger) {
    }

    async createGame({config}: {config:GameConfigInput}, request: any): Promise<Game> {
        this.log.v("Creating new game.")

        if (!Object.values(GameTypes).includes(config.gameType)) {
            throw new HttpError(`Unknown game type. Allowed types
             are ${keysAsString(GameTypes, ', ')}`, 422);
        }

        const gameData = await this.gameService.createGame(config.gameType);
        return Game.from(gameData);
    }

    setReady({setReady}: {setReady:SetReadyInput}, request: any): Promise<Game> {
        this.validatePlayer(setReady.player);
        this.log.v("Setting player %s ready for game %s", setReady.player, setReady.gameId);
        return this.gameService.setPlayerReady(setReady.gameId, setReady.player);
    }

    hello(): string {
        return 'Hi!'
    }

    async getGames(): Promise<Game[]> {
        return (await this.gameService.getGames()).map(Game.from)
    }

    makeMove({move}: { move: MoveInput }, request: any): Promise<Game> {
        this.validatePlayer(move.player);
        this.validatePosition(move.position);
        return Promise.resolve(new Game("",""));
    }

    private validatePlayer(player:PlayerTypes):boolean {
        if (!Object.values(PlayerTypes).includes(player)) {
            throw new HttpError(`Incorrect player type. Allowed types are ${keysAsString(PlayerTypes, ', ')}`, 412)
        }
        return true;
    }

    private validatePosition(position: number):boolean {
        if (position<0 || position > 8) {
            throw new HttpError(`Incorrect position to check. Must be a value between 0-8`, 412)
        }
        return true;
    }
}

export default GraphqlResolver;