// import {GameData} from "../../data/game/IGameRepository";
//
// export enum GameTypes {
//     SINGLE_PLAYER = 'singleplayer',
//     MULTI_PLAYER = 'multiplayer',
// }
//
// export enum PlayerTypes {
//     PLAYER_X = 'X',
//     PLAYER_O = 'O',
//     PLAYER_NONE = 'E',
// }
//
// export interface GameConfigInput {
//     gameType: GameTypes;
// }
//
// export interface SetReadyInput {
//     gameId: string;
//     player: PlayerTypes;
// }
//
// export interface MoveInput {
//     gameId: string;
//     player: PlayerTypes;
//     position: number;
// }
//
// export class Game {
//
//     constructor(public _id: string, public gameType: string) {
//     }
//
//     static from(gameData: GameData): Game {
//         return new Game(gameData._id, gameData.gameType);
//     }
// }
//
// export const GAME_UPDATED_TOPIC = 'gameUpdated';
//
// export interface IGraphqlResolver {
//     createGame: ({config}:{config:GameConfigInput}, request: any) => Promise<Game>;
//     setReady: ({setReady}:{setReady:SetReadyInput}, request: any) => Promise<Game>;
//     makeMove: ({move}: {move:MoveInput}, request: any) => Promise<Game>
//
//     hello: () => string;
//     getGames(): Promise<Game[]>;
//
//     gameUpdated: {
//         subscribe: () =>  AsyncIterator<Game>
//     }
// }