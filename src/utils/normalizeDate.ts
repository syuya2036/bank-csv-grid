export function normalizeDate(raw: string): string {
      if (!raw) return '';
    
      // 区切り文字を除去して 8 桁なら YYYYMMDD とみなす
      const onlyNum = raw.replace(/[./-]/g, '');
      if (/^\d{8}$/.test(onlyNum)) {
        const y = onlyNum.slice(0, 4);
        const m = String(parseInt(onlyNum.slice(4, 6), 10)); // 0 埋め外す
        const d = String(parseInt(onlyNum.slice(6, 8), 10));
        return `${y}/${m}/${d}`;
      }
      // すでに区切り有りの場合は . や - を / に寄せるだけ
      return raw.replace(/[.-]/g, '/');
    }