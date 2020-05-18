import {ActionType, IHistoryRepository} from "./IHistoryRepository";
import {injectable} from "inversify";

@injectable()
export class InMemoryHistoryRepository implements IHistoryRepository{

    addEntry(action: ActionType, gameId:string, message: string, ...args: string[]): void {
    }

}