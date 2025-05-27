// utils/parseYen.ts
export function parseYen(src?: string): number {
      if (!src) return 0;
      // 全角カンマ対策も兼ねて /[,，]/g
      return Number(src.replaceAll(/[,，]/g, '')) || 0;
    }