import {GameData} from "../../data/game/IGameRepository";
import {PlayerTypes} from "../../graphql/apollo/data/data";
import {ActionType, IHistoryRepository} from "../../data/history/IHistoryRepository";
import {inject, injectable} from "inversify";
import {TYPES} from "../../di/types";
import {ILogger} from "../../utils/logger/ILogger";
import "reflect-metadata"
import {groupItems} from "../../utils/TextUtils";
import {ISubscriptionsService} from "../subscriptions/ISubscriptionService";

@injectable()
export class GameOverService {

    constructor(@inject(TYPES.HistoryRepository) private historyRepository: IHistoryRepository,
                @inject(TYPES.Logger) private log: ILogger,
                @inject(TYPES.SubscriptionsService) private subscriptionsService: ISubscriptionsService) {
    }

    async checkGameEnded(game: GameData): Promise<GameData> {

        const hasEmptySpot = game.selections
            .reduce((hasEmpty, playerAtPosition) => hasEmpty || playerAtPosition === PlayerTypes.PLAYER_NONE, false);

        const winner: PlayerTypes = this.checkWinner(game);

        if (winner !== PlayerTypes.PLAYER_NONE) {
            game.ended = true;
            game.winner = winner;
            const message = `Player ${winner} won!`
            this.log.v(message);
            this.historyRepository.addEntry(ActionType.GameOver, game._id, message);
            await this.subscriptionsService.gameHistoryChanged(game._id, message);
        } else if (!hasEmptySpot) {
            game.ended = true;
            const message = `Game ended. No winner!`
            this.log.v(message);
            this.historyRepository.addEntry(ActionType.GameOver, game._id, message);
            await this.subscriptionsService.gameHistoryChanged(game._id, message);
        }
        return game;
    }

    /**
     * Return {PlayerTypes#PLAYER_NONE} if there is no winner, or winning player.
     * @param game
     */
    checkWinner(game: GameData): PlayerTypes {
        // this.log.v("Checking for winner: ", game.selections);
        this.log.v(`Checking for winner: \n${groupItems(game.selections, 3).join('\n')}\n`);
        const winner = Object.values(PlayerTypes)
            .filter(p => p !== PlayerTypes.PLAYER_NONE)
            .reduce((currentWinner, p) => {
                if (
                    (game.selections[0] === p && game.selections[1] === p && game.selections[2] === p) ||
                    (game.selections[3] === p && game.selections[4] === p && game.selections[5] === p) ||
                    (game.selections[6] === p && game.selections[7] === p && game.selections[8] === p) ||
                    (game.selections[0] === p && game.selections[3] === p && game.selections[6] === p) ||
                    (game.selections[1] === p && game.selections[4] === p && game.selections[7] === p) ||
                    (game.selections[2] === p && game.selections[5] === p && game.selections[8] === p) ||
                    (game.selections[0] === p && game.selections[4] === p && game.selections[8] === p) ||
                    (game.selections[2] === p && game.selections[4] === p && game.selections[6] === p)
                ) {
                    return p;
                }
                return currentWinner;
            }, PlayerTypes.PLAYER_NONE)
        return winner;
    }
}