'use client';

import { Copy, ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CopyInput = ({ label, value }: { label: string; value: string }) => {
  const [inputValue, setInputValue] = useState(value);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex-1">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          className="w-full text-gray-900 text-sm bg-transparent border-none outline-none"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
          aria-label={`Скопировать ${label}`}
        >
          <Copy
            className={`w-4 h-4 transition-colors ${copied ? 'text-green-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
    </div>
  );
};

const UrlInput = ({ value }: { value: string }) => {
  const [inputValue, setInputValue] = useState(value);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpen = () => {
    const url = inputValue.startsWith('http') ? inputValue : `https://${inputValue}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full">
      <label className="block text-xs text-gray-500 mb-1">Ссылка</label>
      <div className="flex items-center gap-2">
        <input
          className="w-full text-gray-900 text-sm bg-transparent border-none outline-none"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={handleOpen}
          className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Открыть ссылку"
        >
          <ExternalLink className="w-4 h-4 text-blue-500" />
        </button>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Скопировать ссылку"
        >
          <Copy
            className={`w-4 h-4 transition-colors ${copied ? 'text-green-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
    </div>
  );
};

export const PasswordItem = ({ login = '', password = '', url = '', onDelete }: { login?: string; password?: string; url?: string; onDelete?: () => void }) => {
  return (
    <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 space-y-3">
      <UrlInput value={url} />
      <div className="h-px bg-gray-200" />
      <div className="flex items-center gap-4">
        <CopyInput label="Логин" value={login} />
        <div className="w-px h-8 bg-gray-200" />
        <CopyInput label="Пароль" value={password} />
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-2 py-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Удалить
        </button>
      )}
    </div>
  );
};
