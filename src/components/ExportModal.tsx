// src/components/ExportModal.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useExportService } from '@/hooks/useExportService';
import type { BankCode } from '@/types/bank';

interface Props {
  bank: BankCode;
}

export default function ExportModal({ bank }: Props) {
  const { registerAndDownload } = useExportService(bank);

  return (
    <Button
      onClick={registerAndDownload}
      disabled={!registerAndDownload}
    >
      Export & Register
    </Button>
  );
}
