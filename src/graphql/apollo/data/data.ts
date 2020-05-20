import {GameData} from "../../../data/game/IGameRepository";

export enum GameTypes {
    SINGLE_PLAYER = 'singleplayer',
    MULTI_PLAYER = 'multiplayer',
}

export enum GameStatus {
    PLAYER_READY = "PLAYER_READY",
    PLAYER_MOVE = "PLAYER_MOVE",
    COMPUTER_MOVE = "COMPUTER_MOVE",
    GAME_OVER = "GAME_OVER",
}

export class GameStatusChange {
    constructor(public game: Game, public statusChange: GameStatus) {
    }
}

export class GameStatusChangePayload {
    constructor(public gameStatusChanged: GameStatusChange) {
    }
}

export const SUBSCRIPTION_GAME_STATUS_CHANGED = 'SUBSCRIPTION_GAME_STATUS_CHANGED';

export enum PlayerTypes {
    PLAYER_X = 'X',
    PLAYER_O = 'O',
    PLAYER_NONE = 'E',
}

export interface GameConfigInput {
    gameType: GameTypes;
}

export interface SetReadyInput {
    gameId: string;
    player: PlayerTypes;
}

export interface MoveInput {
    gameId: string;
    player: PlayerTypes;
    position: number;
}

export class Game {

    constructor(public _id: string,
                public gameType: GameTypes,
                public ended: boolean,
                public winner: PlayerTypes,
                public nextPlayer: PlayerTypes,
                public playerXReady: boolean,
                public playerOReady: boolean,
                public selections: Array<PlayerTypes>) {
    }

    static from(gameData: GameData): Game {
        return new Game(gameData._id, gameData.gameType,
            gameData.ended, gameData.winner, gameData.nextPlayer,
            gameData.playerXReady, gameData.playerOReady,
            gameData.selections);
    }
}

export const GAME_UPDATED_TOPIC = 'gameUpdated';