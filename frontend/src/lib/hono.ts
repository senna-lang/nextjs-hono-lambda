import { hc } from "hono/client";
import { AppType } from "../../../hono-lambda/lambda/index";

const LAMBDA_URL = process.env.NEXT_PUBLIC_LAMBDA_URL ?? "";

export const client = hc<AppType>(LAMBDA_URL);
