import {injectable} from "inversify";
import "reflect-metadata";
import {GameData, IGameRepository} from "./IGameRepository";
import {GameTypes} from "../../graphql/apollo/data/data";

@injectable()
class InMemoryGameRepository implements IGameRepository {
    games = new Map<string, GameData>()

    create(type: GameTypes): Promise<GameData> {
        const game = new GameData(""+this.games.size, type);
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