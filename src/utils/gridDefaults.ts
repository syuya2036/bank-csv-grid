// src/utils/gridDefaults.ts
'use client';

import type { DefaultColumnOptions } from 'react-data-grid';

/**
 * 全列共通のデフォルトオプション。
 * - editOnClick: クリックで即編集中
 * - commitOnOutsideClick: セル外クリックでコミット
 */
export const defaultColumnOptions: DefaultColumnOptions<any, any> & {
  editorOptions: any;
} = {
  minWidth: 80,
  resizable: true,
  sortable: false,
  editorOptions: {
    editOnClick: true,
    commitOnOutsideClick: true
  }
};
