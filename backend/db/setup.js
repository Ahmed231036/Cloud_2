const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { neon } = require("@neondatabase/serverless");

dotenv.config({
  path: path.resolve(__dirname, "../../.env.local"),
  quiet: true,
});
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const schema = fs.readFileSync(path.resolve(__dirname, "schema.sql"), "utf8");

sql
  .query(schema)
  .then(() => console.log("Database schema applied."))
  .catch((error) => {
    console.error(`Database schema setup failed: ${error.message}`);
    process.exitCode = 1;
  });
