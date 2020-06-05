import {ISubscriptionsService} from "./ISubscriptionService";
import {
    Game, GameHistoryChange, GameHistoryChangePayload,
    GameStatus,
    GameStatusChange,
    GameStatusChangePayload, SUBSCRIPTION_GAME_HISTORY_CHANGED,
    SUBSCRIPTION_GAME_STATUS_CHANGED
} from "../../graphql/apollo/data/data";
import {inject, injectable} from "inversify";
import {TYPES} from "../../di/types";
import {ILogger} from "../../utils/logger/ILogger";
import {PubSub, ResolverFn, withFilter} from "apollo-server-express";

@injectable()
export class ApolloSubscriptionsService implements ISubscriptionsService {
    pubsub: PubSub;

    constructor(@inject(TYPES.Logger) private log: ILogger) {
        this.pubsub = new PubSub();
    }

    async gameStatusChanged(game: Game, status: GameStatus): Promise<void> {
        await this.pubsub.publish(SUBSCRIPTION_GAME_STATUS_CHANGED,
            new GameStatusChangePayload(new GameStatusChange(game, status)));
    }

    subscribe(): ResolverFn {
        return withFilter(
            (gameId: string) => this.pubsub.asyncIterator([SUBSCRIPTION_GAME_STATUS_CHANGED]),
            (payload: GameStatusChangePayload, {gameId}: { gameId: string }) => payload.gameStatusChanged.game._id === gameId
        )
    }
    subscribeGameHistory(): ResolverFn {
        return withFilter(
            (gameId: string) => this.pubsub.asyncIterator([SUBSCRIPTION_GAME_HISTORY_CHANGED]),
            (payload: GameHistoryChangePayload, {gameId}: { gameId: string }) => payload.gameHistoryChanged.gameId === gameId
        )
    }

    async gameHistoryChanged(gameId: string, message: string): Promise<void> {
        await this.pubsub.publish(SUBSCRIPTION_GAME_HISTORY_CHANGED,
            new GameHistoryChangePayload(new GameHistoryChange(gameId, message)));
    }

}