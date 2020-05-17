import {buildSchema} from "graphql";

const schema = buildSchema(`

    type Game {
        _id: ID!
        gameType: String!
    }
    
    input GameConfigInput {
        gameType: String!
    }
    
    type RootMutation {
        createGame(gameType: String!): Game! 
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
