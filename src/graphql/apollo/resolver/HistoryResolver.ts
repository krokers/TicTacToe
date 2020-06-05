import {IResolvers} from 'graphql-tools';
import {inject, injectable} from "inversify";
import {TYPES} from "../../../di/types";
import {ILogger} from "../../../utils/logger/ILogger";
import {IHistoryRepository} from "../../../data/history/IHistoryRepository";
import {ISubscriptionsService} from "../../../services/subscriptions/ISubscriptionService";

@injectable()
class HistoryResolver {

    constructor(@inject(TYPES.HistoryRepository) private historyRepository: IHistoryRepository,
                @inject(TYPES.Logger) private log: ILogger,
                @inject(TYPES.SubscriptionsService) private subscriptionsService: ISubscriptionsService) {
    }

    getResolvers() {
        const resolverMap: IResolvers = {
            Query: {
                gameHistory: (_: void, {gameId}: {gameId:string}): Array<string> => {
                    const entries = this.historyRepository.getEntries(gameId);
                    return entries ? entries : []
                },
            },
            Subscription: {
                gameHistoryChanged: {
                    subscribe: this.subscriptionsService.subscribeGameHistory(),
                }
            }
        };

        return resolverMap;
    }
}

export default HistoryResolver;
