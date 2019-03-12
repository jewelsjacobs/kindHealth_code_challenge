# Code Challenge

## Uses
- [Sequalize](http://docs.sequelizejs.com/manual/tutorial/migrations.html)
- [Sequalize fixtures](https://github.com/modestfake/sequelize-fixtures)
- [Docker Compose](https://docs.docker.com/compose/)
- [Jest as a test runner and assertion library](https://jestjs.io/)

Runs with a postgresDB in a docker container

WARNING: the start and test scripts will clean up any docker images you have running.

## Start

```bash
$ npm start
```

## Run tests

```bash
$ npm test
```

## Db

Access postgres image psql console:

```bash
$ npm run db:console
```
You can also access the DB via a GUI using the following:

- **host:** 0.0.0.0
- **db:** events_dev
- **user:** postgres
- **no password, just leave it blank**

## API

```bash

curl -X GET 'http://localhost:8000/events/summary?from=2019-02-10T21:03:34Z&to=2019-02-25T21:03:34Z&by=hour'

curl -X GET 'http://localhost:8000/events?from=2019-02-10T21:03:34Z&to=2019-02-25T21:03:34Z&by=hour'

curl -X POST \
  http://localhost:8000/events \
  -H 'Content-Type: application/json' \
  -d '{"date": "1985-10-26T09:00:00Z", "user": "Doc", "type": "enter"}'
  
curl -X POST http://localhost:8000/events/clear

```


