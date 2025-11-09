import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, ChevronUp, X } from "lucide-react";
import TransactionItem from "./TransactionItem";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  type: "expense" | "income";
  date: Date;
}

interface TransactionsProps {
  onBack: () => void;
}

// Mock transactions data
const mockTransactions: Transaction[] = [
  { id: "1", merchant: "Вкусно и точка", category: "Еда", amount: 140, type: "expense", date: new Date(2024, 10, 8) }, // Today
  { id: "2", merchant: "Золотое яблоко", category: "Косметика", amount: 2940, type: "expense", date: new Date(2024, 10, 8) }, // Today
  { id: "3", merchant: "ВкусВилл", category: "Еда", amount: 480, type: "expense", date: new Date(2024, 10, 7) }, // Yesterday
  { id: "4", merchant: "ВкусВилл", category: "Еда", amount: 480, type: "expense", date: new Date(2024, 10, 6) },
  { id: "5", merchant: "ВкусВилл", category: "Еда", amount: 480, type: "expense", date: new Date(2024, 10, 6) },
  { id: "6", merchant: "ВкусВилл", category: "Еда", amount: 480, type: "expense", date: new Date(2024, 10, 5) },
  { id: "7", merchant: "ВкусВилл", category: "Еда", amount: 480, type: "expense", date: new Date(2024, 10, 5) },
  { id: "8", merchant: "ВкусВилл", category: "Еда", amount: 480, type: "expense", date: new Date(2024, 10, 5) },
  { id: "9", merchant: "Зарплата", category: "Доходы", amount: 50000, type: "income", date: new Date(2024, 10, 1) },
  { id: "10", merchant: "Бонус", category: "Доходы", amount: 5000, type: "income", date: new Date(2024, 10, 3) },
  { id: "11", merchant: "Подарок", category: "Доходы", amount: 2000, type: "income", date: new Date(2024, 10, 5) },
];

const categoryColors: Record<string, string> = {
  "Еда": "#9333ea", // purple
  "Косметика": "#f97316", // orange
  "Доходы": "#22c55e", // green
  "Покупки": "#3b82f6", // blue
};

export default function Transactions({ onBack }: TransactionsProps) {
  const [showSourceFilter, setShowSourceFilter] = useState(false);
  const [selectedSource, setSelectedSource] = useState<"all" | "income" | "expense">("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const sourceFilterRef = useRef<HTMLDivElement>(null);

  // Close source filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceFilterRef.current && !sourceFilterRef.current.contains(event.target as Node)) {
        setShowSourceFilter(false);
      }
    };

    if (showSourceFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSourceFilter]);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (txDate.getTime() === today.getTime()) {
      return "Сегодня";
    } else if (txDate.getTime() === yesterday.getTime()) {
      return "Вчера";
    } else {
      return `${date.getDate()} ноября`;
    }
  };

  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions;

    // Filter by source (income/expense)
    if (selectedSource === "income") {
      filtered = filtered.filter(tx => tx.type === "income");
    } else if (selectedSource === "expense") {
      filtered = filtered.filter(tx => tx.type === "expense");
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(tx => selectedCategories.includes(tx.category));
    }

    return filtered;
  }, [selectedSource, selectedCategories]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(tx => {
      const dateKey = formatDate(tx.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  // Calculate category breakdown for expenses
  const categoryBreakdown = useMemo(() => {
    if (selectedSource !== "expense" && selectedSource !== "all") return [];
    
    const expenses = filteredTransactions.filter(tx => tx.type === "expense");
    const breakdown: Record<string, number> = {};
    
    expenses.forEach(tx => {
      breakdown[tx.category] = (breakdown[tx.category] || 0) + tx.amount;
    });

    return Object.entries(breakdown).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: categoryColors[category] || "#gray",
    }));
  }, [filteredTransactions, selectedSource]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter(tx => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  const incomeStats = useMemo(() => {
    const incomes = filteredTransactions.filter(tx => tx.type === "income");
    const total = incomes.reduce((sum, tx) => sum + tx.amount, 0);
    return { total, count: incomes.length };
  }, [filteredTransactions]);

  const expenseStats = useMemo(() => {
    const expenses = filteredTransactions.filter(tx => tx.type === "expense");
    const total = expenses.reduce((sum, tx) => sum + tx.amount, 0);
    return { total, count: expenses.length };
  }, [filteredTransactions]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const removeCategoryFilter = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Транзакции</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {}}
          >
            Ноябрь
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          
          <div className="relative" ref={sourceFilterRef}>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setShowSourceFilter(!showSourceFilter)}
            >
              {selectedSource === "all" ? "Источник" : selectedSource === "income" ? "Доходы" : "Расходы"}
              {showSourceFilter ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>

            {showSourceFilter && (
              <Card className="absolute top-full left-0 mt-2 z-10 min-w-[280px] shadow-lg">
                <div className="p-4">
                  <div className="text-sm font-medium mb-3">Какие транзакции показать?</div>
                  <div className="space-y-2">
                    <button
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => {
                        setSelectedSource("income");
                        setShowSourceFilter(false);
                      }}
                    >
                      <span>Доходы</span>
                      <span className="text-sm text-muted-foreground">
                        +{formatAmount(incomeStats.total)}₽ • {incomeStats.count} транзакции
                      </span>
                    </button>
                    <button
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => {
                        setSelectedSource("expense");
                        setShowSourceFilter(false);
                      }}
                    >
                      <span>Расходы</span>
                      <span className="text-sm text-muted-foreground">
                        -{formatAmount(expenseStats.total)}₽ • {expenseStats.count} транзакции
                      </span>
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Active filters */}
          {selectedSource === "expense" && (
            <Button
              variant="default"
              className="rounded-full bg-primary"
              onClick={() => setSelectedSource("all")}
            >
              Расходы
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
          {selectedCategories.map(category => (
            <Button
              key={category}
              variant="default"
              className="rounded-full"
              style={{ backgroundColor: categoryColors[category] || undefined }}
              onClick={() => removeCategoryFilter(category)}
            >
              {category} {formatAmount(categoryBreakdown.find(c => c.name === category)?.value || 0)}₽
              <X className="ml-2 h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Summary and Chart */}
        {(selectedSource === "expense" || (selectedSource === "all" && selectedCategories.length > 0)) && categoryBreakdown.length > 0 && (
          <Card className="p-6">
            <div className="mb-4">
              <div className="text-2xl font-bold">
                Расходы {formatAmount(totalExpenses)}₽
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-2">
                {categoryBreakdown.map((item) => (
                  <button
                    key={item.name}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => toggleCategory(item.name)}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                    <span className="font-semibold">{formatAmount(item.value)}₽</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Transactions List */}
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([dateKey, transactions]) => (
            <div key={dateKey}>
              <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
                {dateKey}
              </div>
              <Card className="divide-y">
                {transactions.map(tx => (
                  <TransactionItem
                    key={tx.id}
                    merchant={tx.merchant}
                    category={tx.category}
                    amount={tx.amount}
                    type={tx.type}
                  />
                ))}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
