# Code Challenge

## Uses
- [Sequalize](http://docs.sequelizejs.com/manual/tutorial/migrations.html)
- [Docker Compose](https://docs.docker.com/compose/)

Runs with a postgresDB in a docker container

WARNING: the start and test scripts will clean up any docker images you have running.

## Start

```bash
$ npm start
```

## Run tests

**NOTE:** I didnt have time to fix the tests. You can run them but they are broken.

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

### Migrate and Seed Db:

Good to run after `npm start` and `npm test`

```bash
$ npm run db:migrate
$ npm run db:seed
```
or 

```bash
$ NODE_ENV=development ./bin/dbbuild
```

## API

- POST http://localhost:8000/events
- GET http://localhost:8000/events?from=2019-02-10T21:03:34Z&to=2019-02-25T21:03:34Z
- POST http://localhost:8000/events/clear
- GET http://localhost:8000/events/summary?from=2019-02-10T21:03:34Z&to=2019-02-25T21:03:34Z&by=hour

