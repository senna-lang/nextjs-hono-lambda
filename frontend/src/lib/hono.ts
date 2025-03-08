import { hc } from "hono/client";
import { AppType } from "../../../hono-lambda/lambda/index";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_LAMBDA_URL ?? "");
