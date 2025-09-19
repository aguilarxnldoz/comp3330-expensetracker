import "dotenv/config";
import {defineConfig} from "drizzle-kit";

export const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error("No database url");

console.log(DATABASE_URL);

export default defineConfig({
    dialect: "postgresql",
    schema: "./server/db/schema.ts",
    out: "./server/db/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
