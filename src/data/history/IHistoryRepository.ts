export enum ActionType {
    GameCreated= "GameCreated",
    PlayerSetReady= "PlayerSetReady",
}

export interface IHistoryRepository {
    addEntry(action:ActionType, gameId:string, message:string, ...args:string[]):void ;
}