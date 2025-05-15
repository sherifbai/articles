## Installation

# Copy envexample to .env and fill the data

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Migration

```bash
# generate
$ npm run migration:generate --name=${migrationName}

# run
$ npm run migration:run
```
