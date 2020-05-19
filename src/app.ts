import express from 'express'
import {container} from "./di/inversify.config";
import {TYPES} from "./di/types";
import {ILogger} from "./utils/logger/ILogger";
import {ApolloServer, PubSub} from "apollo-server-express";
import { createServer } from 'http';
import schema from "./graphql/apollo/schema"
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {graphqlExpress} from "apollo-server-express/dist/expressApollo";
import bodyParser from 'body-parser';
import { execute, subscribe } from 'graphql';

const PORT = 3000;
class App {

    constructor(private log: ILogger) {
    }

    initialize() {

        // const app = express();
        //
        // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
        //
        // const pubsub = new PubSub();
        // const server = createServer(app);
        //
        // server.listen(PORT, () => {
        //     new SubscriptionServer({
        //         execute,
        //         subscribe,
        //         schema: schema,
        //     }, {
        //         server: server,
        //         path: '/subscriptions',
        //     });
        // });


        const app = express();

        const server = new ApolloServer({schema,
            subscriptions: {
                onConnect: (connectionParams, webSocket, context) => {
                    this.log.v(`Client connected! connectionParams: ${connectionParams}`);
                },
                onDisconnect: (webSocket, context) => {
                    this.log.v("Client disconnected!");
                },
            },
        });
        server.applyMiddleware({ app, path: '/graphql' });
        const httpServer = createServer(app);
        server.installSubscriptionHandlers(httpServer);
        httpServer.listen(
            { port: PORT },
            (): void => {
                this.log.v(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
                this.log.v(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
            });




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
