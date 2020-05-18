export class GameData {
    selections: Array<string> = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
    playerXReady: boolean = false;
    playerOReady: boolean = false;

    constructor(public _id: string, public gameType: string) {
    }
}

export module GameTypes {
    export var SINGLE_PLAYER: string = 'singleplayer';
    export var MULTI_PLAYER: string = 'multiplayer';
}

export interface IGameRepository {
    create(type: string): Promise<GameData>;

    findById(id: string): Promise<GameData | undefined>

    findAll(): Promise<GameData[]>
}