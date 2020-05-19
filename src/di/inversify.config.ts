import { Container } from "inversify";
import { TYPES } from "./types";
import {IGameRepository} from "../data/game/IGameRepository";
import InMemoryGameRepository from "../data/game/GameRespository";
import {IGameService} from "../services/game/IGameService";
import {GameService} from "../services/game/GameService";
import {ILogger} from "../utils/logger/ILogger";
import {WinstonLogger} from "../utils/logger/WinstonLogger";
import {IHistoryRepository} from "../data/history/IHistoryRepository";
import {InMemoryHistoryRepository} from "../data/history/InMemoryHistoryRepository";
import GameResolvers from "../graphql/apollo/resolver/resolverMap";
import {IInputValidators} from "../services/validators/IInputValidators";
import {InputValidators} from "../services/validators/InputValidators";

const container = new Container();
container.bind<IGameRepository>(TYPES.GameRepository).to(InMemoryGameRepository);
container.bind<IHistoryRepository>(TYPES.HistoryRepository).to(InMemoryHistoryRepository)
container.bind<IGameService>(TYPES.GameService).to(GameService);
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger);
container.bind<IInputValidators>(TYPES.InputValidators).to(InputValidators);

container.bind<GameResolvers>(TYPES.GameResolvers).to(GameResolvers);

export { container };