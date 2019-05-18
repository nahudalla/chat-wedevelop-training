# WeDevelop Training Program Chat App (Server)

This repository was created as part of the [Full Stack Beginner Program (Block 3)](https://github.com/WeDevelop-ARG/full-stack-beginner-program/blob/master/content/block-3/index.md) by WeDevelop. 

When finished, this repository will contain the implementation of a simple server for a chat application.

[JavaScript Standard Style](https://standardjs.com) is followed in this project.

## Dependencies

The code is meant to be run in a [Node.js v10](https://nodejs.org) environment and is written using the latest JavaScript features (as of writing) provided by [Babel](https://babeljs.io).

[PostgreSQL](https://postgresql.org/) is used as the database engine. Mappings to access data were created using [Sequelize.js](https://sequelizejs.com). See [Configuration](#configuration) below for instructions to configure database access.

[GraphQL](https://graphql.org) was chosen to expose an API to access the server, and was implemented using [Apollo Server](https://www.apollographql.com) on top of [Express](https://expressjs.com).

## Configuration

To configure database access, edit the file `src/config/config.js`. By default the database name `chat_wedevelop` is used and it is expected that the database exists. Connection options can be set through environment variables `DB_HOST`, `DB_USERNAME` and `DB_PASSWORD`. The server will automatically load environment variables from a `.env` file using the [dotenv](https://www.npmjs.com/package/dotenv) package.

## Installing and running

To use this project, first clone it using `git` and install dependencies using `npm install`:

```
git clone https://github.com/nahudalla/chat-wedevelop-training.git
cd chat-wedevelop-training
npm install
```

Then, compile the sources and run Sequelize Migrations:

```
npm run build
npx sequelize db:migrate
```

Finally, run the server using the `start` script, the GraphQL endpoing will be available at [http://localhost:7777/graphql](http://localhost:7777/graphql):

```
npm start
```

## Development

For development, execute:

```
npm run dev
```

## Tests

To run tests, execute:

```
npm test
```

## License

[MIT](LICENSE)
