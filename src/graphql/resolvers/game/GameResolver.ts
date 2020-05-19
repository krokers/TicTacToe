// import {inject, injectable} from "inversify";
// import "reflect-metadata";
// import {
//     Game,
//     GAME_UPDATED_TOPIC,
//     GameConfigInput,
//     GameTypes,
//     IGraphqlResolver,
//     MoveInput,
//     PlayerTypes,
//     SetReadyInput
// } from "../resolvers";
// import {HttpError} from "../../../utils/HttpError";
// import {TYPES} from "../../../di/types";
// import {ILogger} from "../../../utils/logger/ILogger";
// import {IGameService} from "../../../services/game/IGameService";
// import {keysAsString} from "../../../utils/TextUtils";
// import {PubSub} from 'graphql-subscriptions'
//
// @injectable()
// class GraphqlResolver implements IGraphqlResolver {
//     pubsub:PubSub;
//
//     constructor(@inject(TYPES.GameService) private gameService: IGameService,
//                 @inject(TYPES.Logger) private log: ILogger) {
//         this.pubsub = new PubSub();
//     }
//
//     async createGame({config}: {config:GameConfigInput}, request: any): Promise<Game> {
//         this.log.v("Creating new game.")
//
//         if (!Object.values(GameTypes).includes(config.gameType)) {
//             throw new HttpError(`Unknown game type. Allowed types
//              are ${keysAsString(GameTypes, ', ')}`, 422);
//         }
//
//         const gameData = await this.gameService.createGame(config.gameType);
//         return Game.from(gameData);
//     }
//
//     async setReady({setReady}: { setReady: SetReadyInput }, request: any): Promise<Game> {
//         this.validatePlayer(setReady.player);
//         this.log.v("Setting player %s ready for game %s", setReady.player, setReady.gameId);
//         const gameData = await this.gameService.setPlayerReady(setReady.gameId, setReady.player);
//         const game = Game.from(gameData);
//         await this.pubsub.publish(GAME_UPDATED_TOPIC, {gameUpdated: game})
//         return game;
//     }
//
//     hello(): string {
//         return 'Hi!'
//     }
//
//     async getGames(): Promise<Game[]> {
//         return (await this.gameService.getGames()).map(Game.from)
//     }
//
//     makeMove({move}: { move: MoveInput }, request: any): Promise<Game> {
//         this.validatePlayer(move.player);
//         this.validatePosition(move.position);
//         this.log.v(`Making move. Player: ${move.player} position: ${move.position} gameId: ${move.gameId}` )
//         return this.gameService.makeMove(move.gameId, move.player, move.position);
//     }
//
//     private validatePlayer(player:PlayerTypes):boolean {
//         if (!Object.values(PlayerTypes).includes(player)) {
//             throw new HttpError(`Incorrect player type. Allowed types are ${keysAsString(PlayerTypes, ', ')}`, 412)
//         }
//         return true;
//     }
//
//     private validatePosition(position: number):boolean {
//         if (position<0 || position > 8) {
//             throw new HttpError(`Incorrect position to check. Must be a value between 0-8`, 412)
//         }
//         return true;
//     }
//
//     private gameUpdateSubscription() {
//
//     }
//
//     gameUpdated = {
//         subscribe: () => {
//             console.log("New Subscriber!!!!")
//             return this.pubsub.asyncIterator<any>(GAME_UPDATED_TOPIC);
//         }
//     }
// }
//
// export default GraphqlResolver;