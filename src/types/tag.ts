// File: src/types/tag.ts

// 内部勘定マスタ（Tag）型定義
export type TagType = 'SUBJECT' | 'KPI';

export interface Tag {
  id: string;
  name: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  type?: TagType; // 追加（既存データとの互換のためオプショナル）
}

// ツリー表現用ノード型
export type TagNode = {
  id: string;
  name: string;
  order: number;
  active: boolean;
  children: TagNode[];
  type?: TagType; // 表示制御のため持たせる（KPI色分け/非表示など）
};
