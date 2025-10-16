import {pgTable, serial, varchar, integer} from "drizzle-orm/pg-core";

export const expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),
    title: varchar("title", {length: 100}).notNull(),
    amount: integer("amount").notNull(), // store cents or whole units (we use int here)
    fileUrl: varchar("file_url", {length: 500}), // stores s3 key or null
});
