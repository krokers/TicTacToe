import {injectable} from "inversify";
import "reflect-metadata";
import {GameData, IGameRepository} from "./IGameRepository";
import {v4 as uuid} from 'uuid'

@injectable()
class InMemoryGameRepository implements IGameRepository {
    games = new Map<string, GameData>()

    create(type: string): Promise<GameData> {
        const game = new GameData(uuid(), type);
        this.games.set(game._id, game);
        return Promise.resolve(game);
    }

    findById(id: string): Promise<GameData | undefined> {
        return Promise.resolve(this.games.get(id));
    }

    findAll(): Promise<GameData[]> {
        return Promise.resolve(Array.from(this.games.values()));
    }

    update(game:GameData): Promise<GameData> {
        this.games.set(game._id, game);
        return Promise.resolve(game);
    }
}

export default InMemoryGameRepository