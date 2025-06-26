'use client';
import React, { useState } from 'react';
import { useTags } from '@/hooks/useTags';
import { Tag } from '@/types/tag';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';


/** 内部勘定（タグ）マスタ管理 */
export const TagMasterEditor: React.FC = () => {
  const { tags, isLoading, isError, addTag, editTag, deleteTag } = useTags();
  const [newName, setNewName] = useState('');
  const { toast } = useToast();

  /* 追加 */
  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await addTag(name);
      toast({ title: '追加完了', description: `"${name}" を追加しました` });
      setNewName('');
    } catch (e: any) {
      toast({ variant: 'destructive', title: '追加失敗', description: e.message });
    }
  };

  /* 編集 */
  const handleEdit = async (id: string, prev: string, next: string) => {
    const name = next.trim();
    if (!name || name === prev) return;
    try {
      await editTag(id, name);
      toast({ title: '更新完了', description: `"${prev}" → "${name}"` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: '更新失敗', description: e.message });
    }
  };

  /* 削除 */
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" を削除しますか？`)) return;
    try {
      await deleteTag(id);
      toast({ title: '削除完了', description: `"${name}" を削除しました` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: '削除失敗', description: e.message });
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError)   return <p className="text-red-600">タグ取得に失敗しました</p>;

  return (
    <Card className="p-4 space-y-4">
      {/* 追加フォーム */}
      <div className="flex gap-2">
        <Input
          placeholder="新しいタグ名"
          value={newName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && handleAdd()
          }

          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={!newName.trim()}>
          追加
        </Button>
      </div>

      {/* 一覧テーブル */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-1">名前</th>
            <th className="py-1 w-24">操作</th>
          </tr>
        </thead>
        <tbody>
          {tags?.map((tag: Tag) => (
            <tr key={tag.id} className="border-b">
              <td className="py-1">
                <Input
                  defaultValue={tag.name}
                  className="h-8"
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    handleEdit(tag.id, tag.name, e.target.value)
                  }

                />
              </td>
              <td className="py-1">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(tag.id, tag.name)}
                >
                  削除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
