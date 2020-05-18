export enum ActionType {
    GameCreated= "GameCreated",
    PlayerSetReady= "PlayerSetReady",
    PlayerMove= "PlayerMove",
}

export interface IHistoryRepository {
    addEntry(action:ActionType, gameId:string, message:string, ...args:string[]):void ;
}