# MAH Games API

## Link

An online hosted version of this repository can be found at:

https://mah-games.herokuapp.com/api

The repository for the front-end of this project can be found at:

https://github.com/mhiggins285/mah-games-fe

## About

In this project I have created a API for a board game review website, complete with users and commenting functionality. Please use the GET /api endpoint to see a list of available endpoints, along with requirements for request bodies and available queries.

## Set-up

### Cloning the respository

If you want to work with this repository locally you will need to clone it onto your local machine. To do this, navigate to where in your file system you want the repository to be saved in the command line, and run the following command: 

```bash
git clone https://github.com/mhiggins285/mah-games
```

### Installing dependencies

This repository makes use of a few other packages that you will need to install before it is able to run locally.

To make sure you have all of these installed, run the following command when you first open the repository:

```bash
npm i
```

### Seeding local database

In order to create local databases that the app can access, and seed them with data as contained in the `/db/data/test-data` and `/db/data/development-data` folders, you will first need to set up the databases. To do this open up PSQL in your terminal by using the `psql` command, and then execute the following commands.

```psql
DROP DATABASE IF EXISTS DATABASENAME_test;
DROP DATABASE IF EXISTS DATABASENAME;

CREATE DATABASE DATABASENAME_test;
CREATE DATABASE DATABASENAME;
```

Replace DATABASENAME with a name of your choosing but ensure they are consistent with what you enter in your .env files, the set-up of which are explained below.

If you plan to do this multiple times, to save time you could instead save time by setting up a .sql file with these setup commands in. To run these files, from the terminal command line run this command, where FILEPATH is the location at which said file is located:

```bash
psql -f FILEPATH
```

### Running tests

To run the tests, run the below command, where REGEX is an optional modifier which will run all files which have a regex match to said modifier within their names. For example using `app` will only run the `app.test.js` file.


```bash
npm t REGEX
```

### Setting up environments

Finally, you will need to create two `.env` files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment as specified when creating the databases. The database specified in `.env.test` will be accessed when running tests, and the database specified in `.env.development` will be used when accessing through other means (e.g. making a request to a local port). Make sure that these `.env` files are included in .gitignore.

## System requirements

You will need to install Node v16.9.1 and PSQL v12.9 to run this repository.
