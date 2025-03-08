import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const app = new Hono();

const route = app.get("/", c => {
  return c.json(
    {
      ok: true,
      message: "Hello, World!",
    },
    200
  );
});

export type AppType = typeof route;

export const handler = handle(app);
