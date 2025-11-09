import { ShoppingBag, Coffee, Apple, Building2 } from "lucide-react";

interface TransactionItemProps {
  merchant: string;
  category: string;
  amount: number;
  currency?: string;
  type?: "expense" | "income";
}

const categoryIcons: Record<string, typeof ShoppingBag> = {
  "Еда": Coffee,
  "Косметика": Apple,
  "Покупки": ShoppingBag,
  "Другое": Building2,
};

const categoryColors: Record<string, string> = {
  "Еда": "bg-red-100 text-red-600",
  "Косметика": "bg-green-100 text-green-600",
  "Покупки": "bg-yellow-100 text-yellow-600",
  "Другое": "bg-blue-100 text-blue-600",
};

export default function TransactionItem({ 
  merchant, 
  category, 
  amount, 
  currency = "₽",
  type = "expense" 
}: TransactionItemProps) {
  const Icon = categoryIcons[category] || Building2;
  const colorClass = categoryColors[category] || "bg-gray-100 text-gray-600";
  
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <div 
      className="flex items-center gap-3 py-3 hover-elevate cursor-pointer rounded-lg px-2 -mx-2"
      data-testid={`transaction-${merchant}`}
    >
      <div className={`p-2 rounded-full ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{merchant}</div>
        <div className="text-sm text-muted-foreground">{category}</div>
      </div>
      <div className={`text-base font-semibold tabular-nums ${type === 'expense' ? '' : 'text-green-600'}`}>
        {type === 'expense' ? '-' : '+'}{formatAmount(amount)}{currency}
      </div>
    </div>
  );
}
