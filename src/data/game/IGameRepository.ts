export class GameData {
    selections: Array<string> = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
    playerXReady: boolean = false;
    playerOReady: boolean = false;

    constructor(public _id: string, public gameType: string) {
    }
}

export interface IGameRepository {
    create(type: string): Promise<GameData>;

    findById(id: string): Promise<GameData | undefined>

    findAll(): Promise<GameData[]>

    update(game:GameData): Promise<GameData>;
}