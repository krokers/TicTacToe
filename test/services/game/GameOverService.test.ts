import 'ts-jest'
import {GameOverService} from "../../../src/services/game/GameOverService";
import {ActionType, IHistoryRepository} from "../../../src/data/history/IHistoryRepository";
import {ILogger} from "../../../src/utils/logger/ILogger";
import {GameData} from "../../../src/data/game/IGameRepository";
import {GameTypes, PlayerTypes} from "../../../src/graphql/apollo/data/data";
import {ISubscriptionsService} from "../../../src/services/subscriptions/ISubscriptionService";


describe('End game verification tests', function() {

    let instance: GameOverService;
    const HistoryMock = jest.fn<IHistoryRepository,[]>( () => ({
        addEntry: jest.fn(),
        getEntries: jest.fn(),
    }));

    let historyMock = HistoryMock();

    const subscriptionsServiceMock = jest.fn<ISubscriptionsService, []> (() => ({
        subscribeGameHistory: jest.fn(),
        subscribe: jest.fn(),
        gameHistoryChanged: jest.fn(),
        gameStatusChanged: jest.fn(),
    }));

    beforeEach(() => {
        HistoryMock.mockClear()
        historyMock = HistoryMock();
        const LoggerMock = jest.fn<ILogger,[]>(() => ({
            v: jest.fn(),
            e: jest.fn(),
            i: jest.fn(),
        }) );

        instance = new GameOverService(historyMock, LoggerMock(), subscriptionsServiceMock()  );
    });

    it('Marks game as ended if 3 same items in a first row exist', async function () {
        const gameData = new GameData("MyID", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_X,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_X)
        expect(historyMock.addEntry).toBeCalledWith(ActionType.GameOver, "MyID", "Player X won!");
    });

    it('Marks game as ended if 3 same items in a second row exist', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_O);
    });


    it('Marks game as ended if 3 same items in a third row exist', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_O);
    });


    it('Marks game as ended if 3 same items in a first column exist', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_X);
    });


    it('Marks game as ended if 3 same items in a second column exist', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_O);
        expect(updatedGameData.ended).toBe(true);
    });



    it('Marks game as ended if 3 same items in a third column exist', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_O);
        expect(updatedGameData.ended).toBe(true);
    });


    it('Marks game as ended if 3 same items in a diagonal  exist', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X,
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_X);
    });


    it('Marks game as ended if 3 same items in another diagonal  exist', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_X,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_X);
    });

    it('Marks no winner and game not ended if no 3 items in a row and empty fields exist', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_X,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_NONE);
        expect(updatedGameData.ended).toBe(false);
    });

    it('Marks game ended if all fields occupied but no winner', async function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = await instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_NONE);
        expect(updatedGameData.ended).toBe(true);
    });

});