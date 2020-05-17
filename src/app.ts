import express from 'express'
import graphqlHttp from 'express-graphql';
import graphqlSchema from './graphql/schema';
import GraphqlResolver from "./graphql/resolvers/game/GameResolver";
import {GameService} from "./services/game/GameService";
import InMemoryGameRepository from "./data/game/GameRespository";
import {IGameRepository} from "./data/game/IGameRepository";


const app = express();

const gameRepository:IGameRepository = new InMemoryGameRepository()
const gameService = new GameService(gameRepository)
const resolver = new GraphqlResolver(gameService)

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: resolver,
    graphiql: true,
}))

const port = process.env.TTT_PORT || 8080;
app.listen(port);
