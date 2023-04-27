//postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName
import { Sequelize } from "sequelize-typescript";
import dotenv, { DotenvConfigOutput } from "dotenv";
const env_config: DotenvConfigOutput = dotenv.config();

export default new Sequelize(process.env.DATABASE_URL || "", {
  logging: (payload: any) => {
    console.log(payload);
  },
  models: [process.cwd() + "/src/models/tables/*.ts"],
});
