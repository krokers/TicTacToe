import {PlayerTypes} from "../../graphql/apollo/data/data";

export class GameData {
    selections: Array<string> = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
    playerXReady: boolean = false;
    playerOReady: boolean = false;
    ended: boolean = false;
    nextPlayer:PlayerTypes = PlayerTypes.PLAYER_NONE;
    winner: PlayerTypes = PlayerTypes.PLAYER_NONE;

    constructor(public _id: string, public gameType: string) {
    }
}

export interface IGameRepository {
    create(type: string): Promise<GameData>;

    findById(id: string): Promise<GameData | undefined>

    findAll(): Promise<GameData[]>

    update(game:GameData): Promise<GameData>;
}