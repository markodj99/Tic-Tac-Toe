# Tic-Tac-Toe Praksa-Lilly021

## Authors

- [@markodj99](https://github.com/markodj99)

# Run Locally

### Requirements

To run this project locally, you will need to install the following applications

`node v20.10.0`

`postgres sql database`

Clone the project

```bash
  git clone https://github.com/markodj99/Tic-Tac-Toe.git
```

### Run node js server

Go to backend directory

```bash
  cd ./back
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`SALT`

`PRIVATEKEY`

`EXPIRESIN`

`DATABASENAME`

`DATABASEUSERNAME`

`DATABASEPASSWORD`

`DATABASEPORT`

`DATABASEHOST`

Install dependencies

```bash
  npm i
```

Start server in development mode

```bash
  npm run dev
```

Start server in production mode

```bash
  npm run build
```

```bash
  npm run start
```

### Run react app

Go to frontend directory

```bash
  cd ./front
```

Install dependencies

```bash
  npm i
```

```bash
  npm i -g serve
```

Start react app in development mode

```bash
  npm start
```

Start react app in production mode

```bash
  npm run build
```

```bash
  serve -s -n build
```

# Run Inside Docker Container

### Requirements

To run this project locally, you will need to install the following applications

`Docker Desktop`

Change the following environment variable

`DATABASEHOST='localhost' => DATABASEHOST='database'`

Clone the project

```bash
  git clone https://github.com/markodj99/Tic-Tac-Toe.git
```

Go to project root directory

```bash
  cd ./Tic-Tac-Toe
```

Start docker container

```bash
  docker-compose up
```

Start docker container in detached mode

```bash
  docker-compose up -d
```

Stop docker container

```bash
  docker-compose down
```
