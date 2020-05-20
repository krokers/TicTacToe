import {ILogger} from "./utils/logger/ILogger";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import schema from "./graphql/apollo/schema";
import {createServer} from "http";
import {inject} from 'inversify'
import {TYPES} from "./di/types";
import {ServerConfig} from "./config/ServerConfig";


export class TicTacToeServer {

    constructor(private log: ILogger,
                @inject(TYPES.ServerConfig) private config: ServerConfig) {
    }

    initialize() {

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
            { port: this.config.PORT },
            (): void => {
                this.log.v(`Server ready at http://localhost:${this.config.PORT}${server.graphqlPath}`)
                this.log.v(`Subscriptions ready at ws://localhost:${this.config.PORT}${server.subscriptionsPath}`)
            });
    }
}
