'use client';
import React, { useState } from 'react';
import { useTags } from '@/hooks/useTags';
import { Tag } from '@/types/tag';

/**
 * 内部勘定（タグ）のマスタ管理コンポーネント
 * - Hydration Error 回避のためクライアント側で実装
 */
export const TagMasterEditor: React.FC = () => {
  const { tags, isLoading, isError, addTag } = useTags();
  const [input, setInput] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [pending, setPending] = useState(false);

  async function handleAdd() {
    if (!input.trim()) {
      setErrMsg('入力必須です');
      return;
    }
    setPending(true);
    setErrMsg('');
    try {
      await addTag(input.trim());
      setInput('');
    } catch {
      setErrMsg('追加に失敗しました');
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <div>
        <label>
          内部勘定名（タグ）追加 →{' '}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="例: A勘定"
            disabled={pending}
          />
          <button onClick={handleAdd} disabled={pending || !input.trim()}>
            追加
          </button>
        </label>
        {errMsg && (
          <span style={{ color: 'red', marginLeft: 8 }}>{errMsg}</span>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 'bold' }}>登録済みの内部勘定一覧</div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div style={{ color: 'red' }}>読み込み失敗</div>
        ) : (
          <ul>
            {tags?.map((tag: Tag) => (
              <li key={tag.id}>{tag.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
