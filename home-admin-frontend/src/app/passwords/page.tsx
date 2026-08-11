'use client';

import { Plus, SaveAll } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PasswordBlock, PasswordData } from '../components/Password';

interface ApiBlock {
  id: string;
  title: string;
  passwords: PasswordData[];
}

interface Block {
  id: string;
  title: string;
  items: PasswordData[];
  defaultExpanded: boolean;
}

export default function Page() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8060/passwords')
      .then((res) => res.json())
      .then((data: ApiBlock[]) => {
        const mapped: Block[] = data.map((block) => ({
          id: block.id,
          title: block.title,
          items: block.passwords,
          defaultExpanded: false,
        }));
        setBlocks(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const generateId = () => crypto.randomUUID();

  const handleCreate = () => {
    setBlocks([
      ...blocks,
      {
        id: generateId(),
        title: 'Новая категория',
        items: [{ id: generateId(), url: '', login: '', password: '' }],
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

      {loading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : (
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
                { id: generateId(), url: '', login: '', password: '' },
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
      )}
    </div>
  );
}
