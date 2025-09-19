import "dotenv/config";
import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import {DATABASE_URL} from "../../drizzle.config.ts";

import * as schema from "./schema.ts";

const sql = neon(DATABASE_URL!);
export const db = drizzle(sql, {schema});
export {schema};
