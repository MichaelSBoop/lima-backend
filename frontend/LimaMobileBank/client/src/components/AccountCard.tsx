import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AccountCardProps {
  bankName: string;
  balance: number;
  currency?: string;
  color: string;
}

export default function AccountCard({ bankName, balance, currency = "₽", color }: AccountCardProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <Card className="p-4 hover-elevate cursor-pointer" data-testid={`card-account-${bankName}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${color}`}>
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="font-semibold">{bankName}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold tabular-nums" data-testid={`text-balance-${bankName}`}>
            {formatBalance(balance)}<span className="text-sm ml-0.5">{currency}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
