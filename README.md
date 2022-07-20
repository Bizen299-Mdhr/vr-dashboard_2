# Setup Guidelines

1. Clone repo.
2. Run `yarn` to install dependencies. Do not use npm to install dependencies.
3. Create .env file and add contents from .env.example file and update necessary details.
4. After completing all steps, run mongod in separate terminal.
5. Run `yarn start` in terminal.
6. To add new package run `yarn add packagename`.
7. To add dev dependancies run `yarn add packagename --dev`
6. To remove unwanted package run `yarn remove packagename`.


# Code Guidelines

Basic Coding standards is validated by eslint.
Run `yarn lint` to check for any coding standard violation in your code.
If there is any violation then you are forbidden to make a commit.

Some basic coding standards to maintain are:
1. Complete your statements with semicolon at the end.
2. Indentation must be 4 spaces.
3. Ensure that all variable names are camelcase and avoid using `var` to declare variables. Instead use `let` or `const`
4. Ensure that all folders and files are named in camelcase pattern. Donot name files and folder with initial capital letter.


# Project Structure

1. public

    Public folder contains all necessary assets files like css, images, javascripts for the view template. Assets provided by template is placed inside assets folder. Any other custom css, js and images files are placed in respective folders inside public directory. Folder uploads contains files uploaded via cms. Folder logs contains log files for cms and api.

2. src

    This folder contains all our codes. app.js is the starting point of the application. Other folders are listed as:

    i. config

        This folder contains cmsConfig.js file for listing modules of cms, index.js for configuration and environment variables, passport.js for passport configuration.

    ii. constants

        It contains constant variables.

    iii. controllers

        Controller files for backend and api

    iv. database

        Contains migration and seeder files

    v. helpers

        Contains helper files. Always place helper functions in respective helper files.

    vi. loaders

        Contains initial loader files to initialize database connection, express app and template level variables and functions

    vii. middlewares

        Contains middleware files

    viii. models

        List of models mapping database tables

    ix.routes

        List of routes

    x. services.

        Contains services file for database query.

    xi. transformers

        Contains transformer files to transform the model object to return to api.

    xii. validators

        Validator files for validation on post request from cms and api.

    xiii. views

        All template view files. Folder `layout` contains base layout. Folder `partials` contains partial files to include in other view files.

3. tests

    Contains test files
    
 `npx sequelize-cli migration:create --name - `<br>
 `npx sequelize-cli seed:generate --name -  `
  npx sequelize-cli db:seed --seed 
# DOCKER
- yarn run docker    
- docker ps
- Docker exec -it container_id sh
- npx sequelize-cli db:migrate
- npx sequelize-cli db:seed:all

Service Run 
- redis-server
- yarn start
- yarn watch



