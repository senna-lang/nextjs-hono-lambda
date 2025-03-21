import { useState, useEffect } from "react";
import { client } from "@/lib/hono";
import { Todo, hasTodo, hasTodos } from "@/types/todo";

export const useTodos = () => {
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

  return {
    todos,
    newTodoTitle,
    setNewTodoTitle,
    isLoading,
    error,
    setError,
    createTodo,
    toggleTodoStatus,
    deleteTodo
  };
};