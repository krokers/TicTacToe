import 'graphql-import-node';
import * as typeDefs from './schema/schema.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import GameResolvers from './resolver/GameResolvers';
import { GraphQLSchema } from 'graphql';
import {container} from "../../di/inversify.config";
import {TYPES} from "../../di/types";
import HistoryResolver from "./resolver/HistoryResolver";

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [
        container.get<GameResolvers>(TYPES.GameResolvers).getResolvers(),
        container.get<HistoryResolver>(TYPES.HistoryResolvers).getResolvers(),
    ]
});
export default schema;