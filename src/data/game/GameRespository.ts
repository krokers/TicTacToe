import { injectable } from "inversify";
import "reflect-metadata";
import {GameData, IGameRepository} from "./IGameRepository";
import {v4 as uuid} from 'uuid'

@injectable()
class InMemoryGameRepository implements IGameRepository {
    games = new Map<string, GameData>()

    create(type: string): Promise<GameData> {
        console.log("Creating new game!");
        return new Promise<GameData>((resolve, reject) => {
            const game = new GameData(uuid(), type);
            this.games.set(game._id, game);
            resolve(game);
        });
    }

    findById(id: string): Promise<GameData | undefined> {
        return new Promise<GameData>((resolve, reject) => {
            return this.games.get(id);
        });
    }

    findAll(): Promise<GameData[]> {
        return new Promise<GameData[]>((resolve, reject) => {
            return Array.from(this.games.values());
        });
    }
}

export default InMemoryGameRepository