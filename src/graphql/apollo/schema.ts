// schema.ts
import 'graphql-import-node';
import * as typeDefs from './schema/schema.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import GameResolvers from './resolver/resolverMap';
import { GraphQLSchema } from 'graphql';
import {container} from "../../di/inversify.config";
import {TYPES} from "../../di/types";

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers: new GameResolvers(container.get(TYPES.GameService)).getResolvers(),
});
export default schema;