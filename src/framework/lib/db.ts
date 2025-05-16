import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // Set to true if using Azure
    trustServerCertificate: true, // Required for local dev with self-signed certs
  },
};

let pool: sql.ConnectionPool;

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}
