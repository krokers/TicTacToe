import {buildSchema} from "graphql";

const schema = buildSchema(`

    type Game {
        _id: ID!
        gameType: String!
    }
    
    input GameConfigInput {
        gameType: String!
    }
    
    input SetReadyInput {
        gameId:String!
        player:String!
    }
    
    input MoveInput {
        gameId:String!
        player:String!
        position: Int!
    }
    
    type RootMutation {
        createGame(config: GameConfigInput!): Game!
        setReady(setReady: SetReadyInput!): Game!
        makeMove(move: MoveInput!): Game!
    }

    type RootQuery {
        hello: String
        getGames: [Game!]!
    }
    
    type RootSubscription {
        gameUpdated: Game
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
        subscription: RootSubscription 
    }
    `);

export default schema;
