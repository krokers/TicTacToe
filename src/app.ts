import express from 'express'
import graphqlHttp from 'express-graphql';
import graphqlSchema from './graphql/schema';
import graphqlResolver from './graphql/resolvers/resolvers';

const app = express();

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
}))

const port = process.env.TTT_PORT || 8080;
app.listen(port);
