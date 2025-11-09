import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Wallet, PiggyBank, TrendingUp, ArrowLeft, Check } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  icon: typeof Wallet;
}

const goals: Goal[] = [
  { id: "expense", title: "Контроль расходов", icon: Wallet },
  { id: "savings", title: "Сбережения", icon: PiggyBank },
  { id: "investments", title: "Инвестиции", icon: TrendingUp },
];

interface FinancialGoalsSelectionProps {
  onBack: () => void;
  onNext: (selectedGoals: string[]) => void;
}

export default function FinancialGoalsSelection({ onBack, onNext }: FinancialGoalsSelectionProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const autoContinueTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  // Auto-continue when goals are selected
  useEffect(() => {
    // Clear any existing timeout
    if (autoContinueTimeoutRef.current) {
      clearTimeout(autoContinueTimeoutRef.current);
    }

    // If goals are selected, auto-continue after 1 second
    if (selectedGoals.length > 0) {
      autoContinueTimeoutRef.current = setTimeout(() => {
        onNext(selectedGoals);
      }, 1000);
    }

    return () => {
      if (autoContinueTimeoutRef.current) {
        clearTimeout(autoContinueTimeoutRef.current);
      }
    };
  }, [selectedGoals, onNext]);

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      // Clear auto-continue timeout if user manually clicks
      if (autoContinueTimeoutRef.current) {
        clearTimeout(autoContinueTimeoutRef.current);
      }
      onNext(selectedGoals);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Финансовые цели</h2>
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        <div className="space-y-4 mb-6">
          {goals.map(goal => {
            const Icon = goal.icon;
            const isSelected = selectedGoals.includes(goal.id);
            
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover-elevate ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                data-testid={`button-goal-${goal.id}`}
              >
                <div className={`p-3 rounded-full ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <span className="flex-1 text-left font-medium">{goal.title}</span>
                <Checkbox 
                  checked={isSelected}
                  className="h-5 w-5"
                  data-testid={`checkbox-goal-${goal.id}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto w-full">
        <Button
          onClick={handleNext}
          disabled={selectedGoals.length === 0}
          className="w-full h-12 rounded-xl font-semibold"
          data-testid="button-continue"
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
