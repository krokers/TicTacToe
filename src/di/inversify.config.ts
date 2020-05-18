import { Container } from "inversify";
import { TYPES } from "./types";
import {IGameRepository} from "../data/game/IGameRepository";
import InMemoryGameRepository from "../data/game/GameRespository";
import {IGameService} from "../services/game/IGameService";
import {GameService} from "../services/game/GameService";
import {IGraphqlResolver} from "../graphql/resolvers/resolvers";
import GraphqlResolver from "../graphql/resolvers/game/GameResolver";
import {ILogger} from "../utils/logger/ILogger";
import {WinstonLogger} from "../utils/logger/WinstonLogger";

const container = new Container();
container.bind<IGameRepository>(TYPES.GameRepository).to(InMemoryGameRepository);
container.bind<IGameService>(TYPES.GameService).to(GameService);
container.bind<IGraphqlResolver>(TYPES.IGraphqlResolver).to(GraphqlResolver);
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger);


export { container };