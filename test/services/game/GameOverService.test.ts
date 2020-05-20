import 'ts-jest'
import {GameOverService} from "../../../src/services/game/GameOverService";
import {IHistoryRepository} from "../../../src/data/history/IHistoryRepository";
import {ILogger} from "../../../src/utils/logger/ILogger";
import {GameData} from "../../../src/data/game/IGameRepository";
import {GameTypes, PlayerTypes} from "../../../src/graphql/apollo/data/data";


describe('End game verification tests', function() {

    let instance: GameOverService;

    beforeEach(() => {
        const LoggerMock = jest.fn<ILogger,[]>(() => ({
            v: jest.fn(),
            e: jest.fn(),
            i: jest.fn(),
        }) );
        const HistoryMock = jest.fn<IHistoryRepository,[]>( () => ({
            addEntry: jest.fn(),
        }));
        instance = new GameOverService(HistoryMock(), LoggerMock()  );
    });

    it('Marks game as ended if 3 same items in a first row exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_X,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_X);
    });

    it('Marks game as ended if 3 same items in a second row exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_O);
    });


    it('Marks game as ended if 3 same items in a third row exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_O);
    });


    it('Marks game as ended if 3 same items in a first column exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_X);
    });


    it('Marks game as ended if 3 same items in a second column exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_O);
        expect(updatedGameData.ended).toBe(true);
    });



    it('Marks game as ended if 3 same items in a third column exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_O);
        expect(updatedGameData.ended).toBe(true);
    });


    it('Marks game as ended if 3 same items in a diagonal  exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X,
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_X);
    });


    it('Marks game as ended if 3 same items in another diagonal  exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_X,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_X);
    });

    it('Marks no winner and game not ended if no 3 items in a row and empty fields exist', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_X,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_NONE, PlayerTypes.PLAYER_NONE,
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_NONE);
        expect(updatedGameData.ended).toBe(false);
    });

    it('Marks game ended if all fields occupied but no winner', function () {
        const gameData = new GameData("", GameTypes.SINGLE_PLAYER);
        gameData.selections = [
            PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O,
            PlayerTypes.PLAYER_O, PlayerTypes.PLAYER_X, PlayerTypes.PLAYER_O,
        ]
        const updatedGameData = instance.checkGameEnded(gameData)

        expect(updatedGameData.winner).toBe(PlayerTypes.PLAYER_NONE);
        expect(updatedGameData.ended).toBe(true);
    });

});