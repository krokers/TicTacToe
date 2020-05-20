import {Game, GameStatus} from "../../graphql/apollo/data/data";
import {PubSub} from "apollo-server-express";

export interface ISubscriptionsService {
    pubsub: PubSub;
    gameStatusChanged(game: Game, status: GameStatus): Promise<void>;
}