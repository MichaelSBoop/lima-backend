import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Target, Wallet } from "lucide-react";
import AccountCard from "./AccountCard";
import TransactionItem from "./TransactionItem";
import SpendingChart from "./SpendingChart";
import BudgetChart from "./BudgetChart";
import GoalCard from "./GoalCard";

// todo: remove mock functionality
const mockAccounts = [
  { bankName: "Озон Банк", balance: 1146.28, color: "bg-blue-600" },
  { bankName: "Т-Банк", balance: 28204.43, color: "bg-yellow-500" },
  { bankName: "ВТБ", balance: 6982.12, color: "bg-blue-700" },
];

// todo: remove mock functionality
const mockTransactions = [
  { merchant: "Вкусно и точка", category: "Еда", amount: 140 },
  { merchant: "Золотое яблоко", category: "Косметика", amount: 2940 },
  { merchant: "ВкусВилл", category: "Еда", amount: 480 },
];

// todo: remove mock functionality
const mockChartData = [
  { day: 1, amount: 800 },
  { day: 6, amount: 1200 },
  { day: 11, amount: 1500 },
  { day: 16, amount: 1800 },
  { day: 21, amount: 2100 },
  { day: 26, amount: 2450.31 },
  { day: 30, amount: 2450.31 },
];

interface Budget {
  id: string;
  category: string;
  startDate: Date;
  endDate: Date;
  amount: number;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  startDate: Date;
  endDate: Date;
  autoReplenishment: string;
}

interface DashboardProps {
  onAddBank?: () => void;
  onViewTransactions?: () => void;
  onSetBudget?: () => void;
  onCreateGoal?: () => void;
  budgets?: Budget[];
  goals?: Goal[];
}

export default function Dashboard({ onAddBank, onViewTransactions, onSetBudget, onCreateGoal, budgets = [], goals = [] }: DashboardProps) {
  const [showFABMenu, setShowFABMenu] = useState(false);

  // Calculate spent amount for each budget category
  const getBudgetSpent = (category: string) => {
    return mockTransactions
      .filter(tx => tx.category === category)
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                А
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">Андрей</span>
          </div>
        </div>
      </div>

      {/* Accounts, Transactions, Chart */}
      <div className="p-6 max-w-2xl mx-auto space-y-6 pb-28">
        <div className="space-y-3">
          {mockAccounts.map((account) => (
            <AccountCard key={account.bankName} {...account} />
          ))}
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Транзакции</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewTransactions?.()}
              data-testid="button-all-transactions"
            >
              Все транзакции
            </Button>
          </div>
          <div className="divide-y">
            {mockTransactions.map((tx, i) => (
              <TransactionItem key={i} {...tx} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SpendingChart
            data={mockChartData}
            total={2450.31}
            change={34825.88}
          />
        </Card>

        {/* Budget Charts */}
        {budgets.map((budget) => {
          const spent = getBudgetSpent(budget.category);
          return (
            <Card key={budget.id} className="p-6">
              <BudgetChart
                data={mockChartData}
                spent={spent}
                budget={budget.amount}
                category={budget.category}
              />
            </Card>
          );
        })}

        {/* Goals */}
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            name={goal.name}
            target={goal.target}
            current={goal.current}
            startDate={goal.startDate}
            endDate={goal.endDate}
          />
        ))}
      </div>

      {/* Dimmed backdrop */}
      {showFABMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setShowFABMenu(false)}
        />
      )}

      {/* Bottom menu card */}
      <div className="fixed inset-x-4 bottom-4 z-50">
        <div
          className={`transition-all duration-200 ${
            showFABMenu
              ? "opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 translate-y-4"
          }`}
        >
          <Card className="rounded-3xl p-4 md:p-6 shadow-xl">
            <div className="space-y-3">
              <button
                className="w-full flex items-center gap-4 h-14 px-2 rounded-2xl transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFABMenu(false);
                  onAddBank?.();
                }}
                data-testid="button-add-bank"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary text-white shadow-sm grid place-items-center flex-shrink-0">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="font-medium text-lg">Добавить банк</span>
              </button>

              <button
                className="w-full flex items-center gap-4 h-14 px-2 rounded-2xl transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFABMenu(false);
                  onCreateGoal?.();
                }}
                data-testid="button-create-goal"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary text-white shadow-sm grid place-items-center flex-shrink-0">
                  <Target className="h-6 w-6" />
                </div>
                <span className="font-medium text-lg">Создать цель</span>
              </button>

              <button
                className="w-full flex items-center gap-4 h-14 px-2 rounded-2xl transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFABMenu(false);
                  onSetBudget?.();
                }}
                data-testid="button-set-budget"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary text-white shadow-sm grid place-items-center flex-shrink-0">
                  <Wallet className="h-6 w-6" />
                </div>
                <span className="font-medium text-lg">
                  Установить бюджет
                </span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-transform"
          data-testid="button-fab"
          onClick={(e) => {
            e.stopPropagation();
            setShowFABMenu(!showFABMenu);
          }}
        >
          <Plus
            className={`h-6 w-6 text-white transition-transform ${
              showFABMenu ? "rotate-45" : ""
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
