import express from 'express'
import graphqlHttp from 'express-graphql';
import graphqlSchema from './graphql/schema';
import { container } from "./di/inversify.config";
import {TYPES} from "./di/types";
import {IGraphqlResolver} from "./graphql/resolvers/resolvers";


const app = express();

const resolver = container.get<IGraphqlResolver>(TYPES.IGraphqlResolver);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: resolver,
    graphiql: true,
}))

const port = process.env.TTT_PORT || 8080;
app.listen(port);
