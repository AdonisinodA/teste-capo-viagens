import mysql from "mysql2/promise";
import { env } from "../../config/env.config";

const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  waitForConnections: true,
});

export default pool;
