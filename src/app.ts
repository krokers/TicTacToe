import express from 'express'
import graphqlHttp from 'express-graphql';
import graphqlSchema from './graphql/schema';
import { container } from "./di/inversify.config";
import {TYPES} from "./di/types";
import {IGraphqlResolver} from "./graphql/resolvers/resolvers";
import { GraphQLError } from "graphql";
import {HttpError} from "./utils/HttpError";


const app = express();

const resolver = container.get<IGraphqlResolver>(TYPES.IGraphqlResolver);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: resolver,
    graphiql: true,
    customFormatErrorFn(err: GraphQLError) {
        if (!err.originalError || !(err.originalError instanceof HttpError) ){
            return err;
        }
        const httpError = err.originalError;
        const message = httpError.message || 'An error occured';
        const code = httpError.statusCode || 500;
        return { message: message, status: code};
    }
}))

const port = process.env.TTT_PORT || 8080;
app.listen(port);
