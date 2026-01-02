import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const migrationsDir = join(__dirname, "migrations");

const run = async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const files = readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    await client.query(sql);
    console.log(`Applied ${file}`);
  }

  await client.end();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
