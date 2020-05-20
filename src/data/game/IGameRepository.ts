import {GameTypes, PlayerTypes} from "../../graphql/apollo/data/data";

export class GameData {
    selections: Array<PlayerTypes> = [PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
        PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
        PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE];
    playerXReady: boolean = false;
    playerOReady: boolean = false;
    ended: boolean = false;
    nextPlayer:PlayerTypes = PlayerTypes.PLAYER_NONE;
    winner: PlayerTypes = PlayerTypes.PLAYER_NONE;
    host: PlayerTypes = PlayerTypes.PLAYER_X;

    constructor(public _id: string, public gameType: GameTypes) {
    }
}

export interface IGameRepository {
    create(type: string): Promise<GameData>;

    findById(id: string): Promise<GameData | undefined>

    findAll(): Promise<GameData[]>

    update(game:GameData): Promise<GameData>;
}