# NodeJS + Sequelize + GraphQL

## Getting the server started

Have [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) installed.

1. Run `docker-compose up` (might a few minutes)
2. GraphQL should be up at [http://localhost:3000/graphql](http://localhost:3000/graphql)

If it doesn't seem to work for no reason, NodeJS might be trying to start before
PostgreSQL is ready. Stop/kill the command and run step #1 again.
