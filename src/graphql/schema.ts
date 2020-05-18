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
    
    
    type RootMutation {
        createGame(config: GameConfigInput!): Game!
        setReady(setReady: SetReadyInput!): Game!
    }

    type RootQuery {
        hello: String
        getGames: [Game!]!
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `);

export default schema;
