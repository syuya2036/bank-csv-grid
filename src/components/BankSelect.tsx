// src/components/BankSelect.tsx
import { BankCode } from '@/converters';
import { Select, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select';

interface Props { value: BankCode; onChange(v: BankCode): void }

export default function BankSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={v => onChange(v as BankCode)}>
      <SelectTrigger className="w-40" />
      <SelectContent>
        <SelectItem value="paypay">PayPay</SelectItem>
        <SelectItem value="gmo">GMO あおぞら</SelectItem>
        <SelectItem value="sbi">住信SBI</SelectItem>
        <SelectItem value="mizuhoebiz">みずほ銀行ｅＢｉｚ</SelectItem>
      </SelectContent>
    </Select>
  );
}