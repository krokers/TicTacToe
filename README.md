# Tic Tac Toe 

Node.js backend implementation for classic tic-tac-toe game. Exposes
ready to use GraphQL API. Perfect playground for front-end applications
 written using framework of your choice.

## Getting Started


### Prerequisites

 * To compile and run the project locally on your machine, you Node.js runtime environment. For install details, visit https://nodejs.org/en/
 * By default, server starts on port 3000, but you can change that by defining <code>TTT_PORT</code> environment variable.

### Installing

 1. Install dependencies
    ```
    $npm install
    ```
 2. Run development server localy<br>
    ```
    $npm run dev
    ```
 3. Now you should be able to open following URL via your browser<br>
    ```
    http://localhost:3000/graphql
    ```

### Interacting with the API
Game have two modes: <code>singleplayer</code> and <code>multiplayer</code>.
Below you can see a flows for both types.

#### Multi player
1. Create a game using <code>createGame</code> mutation. Pass "multiplayer" as a value for gameType parameter.
1. Set the state of the player to "ready" by invoking  <code>setPlayerReady</code> mutation. This action need to be taken by both players ("X" and "O"). When both players are ready, engine picks the first player.
1. Place X or O at the right position. Use <code>makeMove</code> mutation for that. You will have to provide a player ("X" or "O") and ID of game returned in first step.
1. When game ends, you will be notified via subscription with proper event.

#### Single player
1. Create a game using <code>createGame</code> mutation. Pass "singleplayer" as a value for gameType parameter.
1. Place X at the right position. Use <code>makeMove</code> mutation for that. By default, human is assigned an "X" as a player. 
1. When game ends, you will be notified via subscription with proper event.

#### Subscriptions
Game allows also to listen for updates via GraphQL subscriptions mechanism.
You can register for events of selected game using <code>gameStatusChanged</code> subscription.

#### Game History
It is possible to check the history of existing game. In order to get the list of
messages related to selected game use <code>gameHistory</code> query. 

## Running the tests

In order to run test, simply issue the command bellow:
```
$npm run test
``` 

## Architecture
Application uses clean separation between layers.
* **api** - Exposes GraphQL API. Related classes are placed in <code>./src/graphql/</code> folder
* **service** - Business logic for the game.  
* **data** - Repositories used by the application. For simplicity uses "in-memory" variant. But due to exposed interfaces, can be easily replaced by real database. 

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime built 
* [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.
* [GraphQL](https://graphql.org/) - A query language for your API
* [InversifyJS](http://inversify.io/) - Inversion of control container for JavaScript & Node.js apps powered by TypeScript.
* [Express](https://expressjs.com/) - Web framework for Node.js
* [Jest](https://jestjs.io/en/) - JavaScript Testing Framework

## Contributing
Project was not originally meant for contributions. However, if you cannot resist the urge, or find a bug. Feel free to report an issue and push a PR.

## Authors

* **Rafal Swierkot**

## License

[Apache Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)
