const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql'); 
const getUserSchema = require('./src/v1/models/userSchema');
const userResolver = require('./src/v1/controllers/userResolver');

const app = express();
async function setupServer() {
try {
    const userSchema = await getUserSchema(); // Await the promise to get the schema

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', require('./src/v1/routes'));
app.use('/gql', graphqlHTTP({
    schema: userSchema,
    rootValue: userResolver,
    graphiql: true,
  }));
} catch (error) {
    console.error('Failed to start the GraphQL server:', error);
  }

}

setupServer();

module.exports = app;
