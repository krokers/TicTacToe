import {Game, GameStatus} from "../../graphql/apollo/data/data";
import {ResolverFn} from "apollo-server-express";

export interface ISubscriptionsService {
    gameStatusChanged(game: Game, status: GameStatus): Promise<void>;
    subscribe(): ResolverFn;

    gameHistoryChanged(gameId: string, message: string): Promise<void>;
    subscribeGameHistory(): ResolverFn;
}