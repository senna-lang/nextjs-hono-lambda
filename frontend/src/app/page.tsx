"use client";

import { client } from "@/lib/hono";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// 型ガード関数
const hasTodo = (data: unknown): data is { ok: boolean; todo: Todo } => {
  return (
    typeof data === "object" &&
    data !== null &&
    "ok" in data &&
    (data as { ok: boolean }).ok &&
    "todo" in data
  );
};

const hasTodos = (data: unknown): data is { ok: boolean; todos: Todo[] } => {
  return (
    typeof data === "object" &&
    data !== null &&
    "ok" in data &&
    (data as { ok: boolean }).ok &&
    "todos" in data
  );
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODOの取得
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const res = await client.todos.$get();
      const data = await res.json();
      if (hasTodos(data)) {
        setTodos(data.todos);
      } else {
        setError("TODOの取得に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // TODOの作成
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const res = await client.todos.$post({
        json: { title: newTodoTitle },
      });
      const data = await res.json();
      if (hasTodo(data)) {
        setTodos([...todos, data.todo]);
        setNewTodoTitle("");
      } else {
        setError("TODOの作成に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました");
      console.error(err);
    }
  };

  // TODOの更新（完了状態の切り替え）
  const toggleTodoStatus = async (id: string, completed: boolean) => {
    try {
      const res = await client.todos[":id"].$put({
        param: { id },
        json: { completed: !completed },
      });
      const data = await res.json();
      if (hasTodo(data)) {
        setTodos(todos.map(todo => (todo.id === id ? data.todo : todo)));
      } else {
        setError("TODOの更新に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました");
      console.error(err);
    }
  };

  // TODOの削除
  const deleteTodo = async (id: string) => {
    try {
      const res = await client.todos[":id"].$delete({
        param: { id },
      });
      const data = await res.json();
      if (data.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      } else {
        setError("TODOの削除に失敗しました");
      }
    } catch (err) {
      setError("エラーが発生しました");
      console.error(err);
    }
  };

  // 初回レンダリング時にTODOを取得
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button className="float-right" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* 新規TODO作成フォーム */}
      <form onSubmit={createTodo} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            placeholder="新しいTODOを入力..."
            className="flex-grow p-2 border rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            追加
          </button>
        </div>
      </form>

      {/* TODOリスト */}
      {isLoading ? (
        <p>読み込み中...</p>
      ) : todos.length === 0 ? (
        <p>TODOがありません</p>
      ) : (
        <ul className="space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoStatus(todo.id, todo.completed)}
                  className="mr-2"
                />
                <span
                  className={todo.completed ? "line-through text-gray-500" : ""}
                >
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
