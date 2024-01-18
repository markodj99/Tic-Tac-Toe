interface DbConfig {
  username: string,
  password: string,
  database: string,
  host: string,
  max: number,
  min: number,
  idle: number
}

const dbConfig:DbConfig =   {
    username: "postgres",
    password: "strongpassword",
    database: "tictactoe",
    host: "localhost",
    max: 9,
    min: 0,
    idle: 10000
  };

export default dbConfig;