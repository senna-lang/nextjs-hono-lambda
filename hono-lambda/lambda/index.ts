import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { cors } from "hono/cors";
import { z } from "zod";

// TODOアイテムの型定義
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// APIレスポンスの型定義
type TodosResponse = {
  ok: boolean;
  todos: Todo[];
};

type TodoResponse = {
  ok: boolean;
  todo: Todo;
};

type ErrorResponse = {
  ok: boolean;
  message: string;
};

type MessageResponse = {
  ok: boolean;
  message: string;
};

// バリデーションスキーマ
const todoCreateSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
});

const todoUpdateSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").optional(),
  completed: z.boolean().optional(),
});

// メモリ内データストア
const todos: Map<string, Todo> = new Map();

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "*", // すべてのオリジンを許可
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
    credentials: false, // credentialsをfalseに変更（'*'を使用する場合は必須）
  })
);

const route = app
  .get("/", c => {
    return c.json<MessageResponse>(
      {
        ok: true,
        message: "Todo API is running!",
      },
      200
    );
  })

  // TODOの全件取得
  .get("/todos", c => {
    return c.json<TodosResponse>({
      ok: true,
      todos: Array.from(todos.values()),
    });
  })

  // TODOの個別取得
  .get("/todos/:id", c => {
    const id = c.req.param("id");
    const todo = todos.get(id);

    if (!todo) {
      return c.json<ErrorResponse>(
        {
          ok: false,
          message: "Todo not found",
        },
        404
      );
    }

    return c.json<TodoResponse>({
      ok: true,
      todo,
    });
  })

  // TODOの作成
  .post("/todos", zValidator("json", todoCreateSchema), async c => {
    const { title } = c.req.valid("json");

    const newTodo: Todo = {
      id: generateId(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.set(newTodo.id, newTodo);

    return c.json<TodoResponse>(
      {
        ok: true,
        todo: newTodo,
      },
      201
    );
  })

  // TODOの更新
  .put("/todos/:id", zValidator("json", todoUpdateSchema), async c => {
    const id = c.req.param("id");
    const todo = todos.get(id);

    if (!todo) {
      return c.json<ErrorResponse>(
        {
          ok: false,
          message: "Todo not found",
        },
        404
      );
    }

    const data = c.req.valid("json");

    const updatedTodo: Todo = {
      ...todo,
      ...(data.title !== undefined && { title: data.title }),
      ...(data.completed !== undefined && { completed: data.completed }),
      updatedAt: new Date().toISOString(),
    };

    todos.set(id, updatedTodo);

    return c.json<TodoResponse>({
      ok: true,
      todo: updatedTodo,
    });
  })

  // TODOの削除
  .delete("/todos/:id", c => {
    const id = c.req.param("id");
    const exists = todos.has(id);

    if (!exists) {
      return c.json<ErrorResponse>(
        {
          ok: false,
          message: "Todo not found",
        },
        404
      );
    }

    todos.delete(id);

    return c.json<MessageResponse>({
      ok: true,
      message: "Todo deleted successfully",
    });
  });

export const GET = handle(route);
export const POST = handle(route);
export const PUT = handle(route);
export const PATCH = handle(route);
export const DELETE = handle(route);

export type AppType = typeof route;

export const handler = handle(route);
