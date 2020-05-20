import {GameData} from "../../data/game/IGameRepository";
import {PlayerTypes} from "../../graphql/apollo/data/data";

export interface IGameOverService {
    checkGameEnded(game: GameData): GameData;

    checkWinner(game: GameData): PlayerTypes;
}