import {ActionType, IHistoryRepository} from "./IHistoryRepository";
import {injectable, inject} from "inversify";
import {TYPES} from "../../di/types";
import {ILogger} from "../../utils/logger/ILogger";

@injectable()
export class InMemoryHistoryRepository implements IHistoryRepository{

    logs = new Map<string, Array<string>>()

    constructor(@inject(TYPES.Logger) private log: ILogger) {
    }

    addEntry(action: ActionType, gameId:string, message: string): void {

        if (!this.logs.has(gameId)) {
            this.logs.set(gameId, new Array<string>());
        }
        const gameLogList = this.logs.get(gameId) as string [];
        gameLogList.push(action + ":" + message);
    }

    getEntries(gameId: string): Array<string> | undefined {
        const entries = this.logs.has(gameId) ? this.logs.get(gameId) as Array<string> : [];
        this.log.v(`Requesting logs for game: ${gameId}. Number of entries ${entries.length}` );
        return entries;
    }

}