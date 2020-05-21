import {IResolvers} from 'graphql-tools';
import {inject, injectable} from "inversify";
import {TYPES} from "../../../di/types";
import {ILogger} from "../../../utils/logger/ILogger";
import {IHistoryRepository} from "../../../data/history/IHistoryRepository";

@injectable()
class HistoryResolver {

    constructor(@inject(TYPES.HistoryRepository) private historyRepository: IHistoryRepository,
                @inject(TYPES.Logger) private log: ILogger) {
    }

    getResolvers() {
        const resolverMap: IResolvers = {
            Query: {
                gameHistory: (_: void, {gameId}: {gameId:string}): Array<string> => {
                    const entries = this.historyRepository.getEntries(gameId);
                    return entries ? entries : []
                },
            }
        };

        return resolverMap;
    }
}

export default HistoryResolver;
