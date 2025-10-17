// server/app.ts
import {Hono} from "hono";
import {serveStatic} from "hono/bun";
import {logger} from "hono/logger";
import {expensesRoute} from "./routes/expenses";
import {authRoute} from "./auth/kinde";
import {cors} from "hono/cors";
import {secureRoute} from "./routes/secure";
import {uploadRoute} from "./routes/upload";
export const app = new Hono();

// Static Assets

app.use("/*", serveStatic({root: "./server/public"}));

// -------------------

// app.use(
//     "/api/*",
//     cors({
//         origin: "http://localhost:5173",
//         allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
//         allowHeaders: ["Content-Type", "Authorization"],
//     })
// );

// Global logger (from Lab 1)
app.use("*", logger());

// Custom timing middleware
app.use("*", async (c, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    // Add a response header so we can see timings in curl or other clients
    c.header("X-Response-Time", `${ms}ms`);
});

// Health & root
app.get("/", (c) => c.json({message: "OK"}));
app.get("/health", (c) => c.json({status: "healthy"}));

// Mount API routes

app.route("/api/upload", uploadRoute);
app.route("/api/secure", secureRoute);
app.route("/api/auth", authRoute);
app.route("/api/expenses", expensesRoute);

app.get("*", async (c, next) => {
    const url = new URL(c.req.url);
    if (url.pathname.startsWith("/api")) return next();
    // serve index.html
    return (c.env as any)?.ASSETS ? await (c.env as any).ASSETS.fetch(new Request("index.html")) : c.html(await Bun.file("./server/public/index.html").text());
});
