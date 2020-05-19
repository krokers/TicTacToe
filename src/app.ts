import express from 'express'
import {container} from "./di/inversify.config";
import {TYPES} from "./di/types";
import {ILogger} from "./utils/logger/ILogger";
import {ApolloServer} from "apollo-server-express";
import { createServer } from 'http';
import schema from "./graphql/apollo/schema"

class App {

    constructor(private log: ILogger) {
    }

    initialize() {

        // const resolvers = container.get<IGraphqlResolver>(TYPES.IGraphqlResolver);
        const app = express();

        const server = new ApolloServer({schema});
        server.applyMiddleware({ app, path: '/graphql' });
        const httpServer = createServer(app);
        httpServer.listen(
            { port: 3000 },
            (): void => this.log.v(`GraphQL is now running on http://localhost:3000/graphql`));

        //
        // const subscriptionsEndpoint = `ws://localhost:${8181}/subscriptions`;
        //
        // app.use('/graphql', graphqlHttp({
        //     schema: graphqlSchema,
        //     rootValue: resolver,
        //     graphiql: true,
        //     customFormatErrorFn: (err: GraphQLError) => {
        //         this.log.e(err.message)
        //         if (!err.originalError || !(err.originalError instanceof HttpError)) {
        //             return err;
        //         }
        //         const httpError = err.originalError;
        //         const message = httpError.message || 'An error occurred';
        //         const code = httpError.statusCode || 500;
        //         return {message: message, status: code};
        //     }
        // }))
        //
        // const port = process.env.TTT_PORT || 8080;
        // app.listen(port);
    }
}

//TODO: inject server config
new App(container.get(TYPES.Logger)).initialize();
