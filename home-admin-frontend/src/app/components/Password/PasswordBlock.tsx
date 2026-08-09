'use client';

import { Plus, Save, CircleX } from 'lucide-react';
import { useState } from 'react';
import { PasswordItem } from './PasswordItem';

export interface PasswordData {
  id: number;
  url: string;
  login: string;
  password: string;
}

export interface PasswordBlockProps {
  id: number;
  title: string;
  items: PasswordData[];
  onTitleChange?: (title: string) => void;
  onAddItem?: () => void;
  onDeleteItem?: (itemId: number) => void;
  onDeleteBlock?: () => void;
  defaultExpanded?: boolean;
}

export const PasswordBlock = ({
  title,
  items,
  onTitleChange,
  onAddItem,
  onDeleteItem,
  onDeleteBlock,
  defaultExpanded = false,
}: PasswordBlockProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div>
      <div
        className={`flex justify-between items-center bg-gray-200 py-2 px-4 ${expanded ? 'rounded-t-2xl' : 'rounded-2xl'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <input
          className="text-gray-900 text-lg font-semibold bg-transparent border-none outline-none"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
        {onDeleteBlock && (
          <CircleX
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBlock();
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
          />
        )}
      </div>
      {expanded && (
        <div className="bg-gray-100 space-y-2 rounded-b-2xl pb-2">
          {items.map((item, index) => (
            <PasswordItem
              key={item.id}
              url={item.url}
              login={item.login}
              password={item.password}
              onDelete={() => onDeleteItem?.(item.id)}
            />
          ))}
          <div className="flex">
            {onAddItem && (
              <button
                onClick={onAddItem}
                className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить
              </button>
            )}
            <button className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              <Save className="w-4 h-4" />
              Сохранить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
