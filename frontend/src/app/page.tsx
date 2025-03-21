"use client";

import { useTodos } from "@/hooks/useTodos";
import { ErrorMessage } from "@/components/ErrorMessage";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const {
    todos,
    newTodoTitle,
    setNewTodoTitle,
    isLoading,
    error,
    setError,
    createTodo,
    toggleTodoStatus,
    deleteTodo
  } = useTodos();

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">TODOアプリ</h1>
      
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      
      <TodoForm 
        value={newTodoTitle}
        onChange={setNewTodoTitle}
        onSubmit={createTodo}
      />
      
      {isLoading ? (
        <LoadingIndicator />
      ) : todos.length === 0 ? (
        <EmptyState />
      ) : (
        <TodoList 
          todos={todos} 
          onToggle={toggleTodoStatus} 
          onDelete={deleteTodo} 
        />
      )}
    </div>
  );
}