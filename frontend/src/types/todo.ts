// Todo関連の型定義
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// APIレスポンスの型
export interface TodoResponse {
  ok: boolean;
  todo: Todo;
}

export interface TodosResponse {
  ok: boolean;
  todos: Todo[];
}

// 型ガード関数
export const hasTodo = (data: unknown): data is TodoResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "ok" in data &&
    (data as { ok: boolean }).ok &&
    "todo" in data
  );
};

export const hasTodos = (data: unknown): data is TodosResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "ok" in data &&
    (data as { ok: boolean }).ok &&
    "todos" in data
  );
};