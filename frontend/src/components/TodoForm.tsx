import React from 'react';

interface TodoFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
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
  );
};