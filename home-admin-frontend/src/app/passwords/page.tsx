'use client';

import { Plus, SaveAll } from 'lucide-react';
import { useState } from 'react';
import { PasswordBlock, PasswordData } from '../components/Password';

const initialBlocks = [
  {
    id: 1,
    title: 'Работа',
    items: [
      {
        id: 1,
        url: 'https://work.company.com',
        login: 'work@company.com',
        password: 'WorkPass123!',
      },
      {
        id: 2,
        url: 'https://admin.company.com',
        login: 'admin',
        password: 'AdminPass456',
      },
    ],
    defaultExpanded: false,
  },
  {
    id: 2,
    title: 'Личное',
    items: [
      {
        id: 3,
        url: 'https://gmail.com',
        login: 'personal@gmail.com',
        password: 'Personal789',
      },
    ],
    defaultExpanded: false,
  },
];

export default function Page() {
  const [blocks, setBlocks] =
    useState<
      { id: number; title: string; items: PasswordData[]; defaultExpanded: boolean }[]
    >(initialBlocks);

  const getNextItemId = () => {
    const allIds = blocks.flatMap((b) => b.items.map((i) => i.id));
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
  };

  const getNextBlockId = () => {
    const allIds = blocks.map((b) => b.id);
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
  };

  const handleCreate = () => {
    setBlocks([
      ...blocks,
      {
        id: getNextBlockId(),
        title: 'Новая категория',
        items: [{ id: getNextItemId(), url: '', login: '', password: '' }],
        defaultExpanded: true,
      },
    ]);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Пароли
        </h1>
        {/* <p className="text-sm sm:text-base text-gray-600 mt-2">
          Управление паролями
        </p> */}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Создать
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
          <SaveAll className="w-5 h-5" />
          Сохранить всё
        </button>
      </div>

      <div className="space-y-2">
        {blocks.map((block, index) => (
          <PasswordBlock
            key={block.id}
            id={block.id}
            title={block.title}
            items={block.items}
            defaultExpanded={block.defaultExpanded}
            onTitleChange={(title) => {
              const updated = [...blocks];
              updated[index].title = title;
              setBlocks(updated);
            }}
            onAddItem={() => {
              const updated = [...blocks];
              updated[index].items = [
                ...updated[index].items,
                { id: getNextItemId(), url: '', login: '', password: '' },
              ];
              setBlocks(updated);
            }}
            onDeleteItem={(itemId) => {
              const updated = [...blocks];
              updated[index].items = updated[index].items.filter(
                (item) => item.id !== itemId
              );
              setBlocks(updated);
            }}
            onDeleteBlock={() => {
              setBlocks(blocks.filter((b) => b.id !== block.id));
            }}
          />
        ))}
      </div>
    </div>
  );
}
