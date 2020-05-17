import {buildSchema} from "graphql";

const schema = buildSchema(`
    type RootQuery {
        hello: String    
    }
    schema {
        query: RootQuery
    }
    `);

export default schema;