import {GameData, IGameRepository} from "../../data/game/IGameRepository";

export class GameService {
    constructor(private gameRepository: IGameRepository) {}

    createGame(gameType: string):Promise<GameData> {
        return this.gameRepository.create(gameType);
    }

    getGames(): Promise<GameData[]>{
        return this.gameRepository.findAll();
    }
}