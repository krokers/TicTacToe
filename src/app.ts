import {container} from "./di/inversify.config";
import {TYPES} from "./di/types";
import {TicTacToeServer} from "./TicTacToeServer";

new TicTacToeServer(
    container.get(TYPES.Logger),
    container.get(TYPES.ServerConfig)
).initialize();
