export enum ActionType {
    GameCreated= "GameCreated",
    PlayerSetReady= "PlayerSetReady",
    SelectedFirstPlayer= "SelectedFirstPlayer",
    PlayerMove= "PlayerMove",
    GameOver= "GameOver",
}

export interface IHistoryRepository {
    addEntry(action:ActionType, gameId:string, message:string, ...args:string[]):void ;

    getEntries(gameId: string):Array<string> | undefined
}