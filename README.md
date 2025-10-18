## For install dev dependency of typescript

npm i -D typescript

## For tsconfig.json file

npx tsc --init

## Add types of node

npm i -D @types/node

## Prettier Setup

npm install --save-dev --save-exact prettier

## Setup eslint

npm install --save-dev eslint @eslint/js typescript-eslint

## Setup husky

npm install --save-dev husky

## husky init

npx husky init

## Install lint-staged

npm install --save-dev lint-staged

## Install dotenv

npm install dotenv --save

## Express Setup for typescript

npm i express
npm i -D @types/express

## Nodemon setup

npm i -D nodemon ts-node

## Logger Setup

npm i winston
npm i -D @types/winston

## Http-Error

npm i http-error
npm i -D @types/http-errors

## Jest Setup

npm install --save-dev jest
npm install --save-dev @types/jest
npx ts-jest config:init

## Supertest

npm install supertest --save-dev
npm install @types/supertest --save-dev
npm install ts-jest --save-dev

## Build Docker File

docker build -t auth-service:dev -f docker/dev/Dockerfile .

## List all Docker Images

docker image ls

## Docker Image Run

docker run --rm -it -v "${PWD}:/usr/src/app" -v "/usr/src/app/node_modules" --env-file "${PWD}/.env" -p 5501:5501 -e NODE_ENV=development auth-service:dev

# husky pre-commit

npx lint-staged

## Docker Volume for Postgres

docker pull postgres

docker volume create mernpgdata

docker volume ls

docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres

docker ps

## TypeORM setup

npm i typeorm --save

npm i reflect-metadata --save

npm install pg --save

npx typeorm init --database postgres

## ignore husky verification

git commit -m "commit" --no-verify

# Important Resources

https://typescript-eslint.io/

https://eslint.org/docs/latest/

```
"dev": "cross-env NODE_ENV=dev nodemon src/server.ts"

```

## For migration

## Generate Migration

```
npm run migration:generate -- src/migration/migration -d src/config/data-source.ts
```

### Run Migration

```
npm run migration:run -- -d src/config/data-source.ts
```

### Create Migration

```
npm run migration:create -- src/migration/YourMigrationName -d src/config/data-source.ts
```
