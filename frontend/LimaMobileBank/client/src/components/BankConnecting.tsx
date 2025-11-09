import { useEffect, useState } from "react";
import { BarChart3, Coins, CreditCard } from "lucide-react";

type LoadingStage = "transactions" | "accounts" | "balance";

interface BankConnectingProps {
  onComplete: () => void;
  onError: () => void;
}

const stages: { key: LoadingStage; icon: typeof BarChart3; text: string; duration: number }[] = [
  { key: "transactions", icon: BarChart3, text: "Анализируем ваши транзакции...", duration: 2000 },
  { key: "accounts", icon: CreditCard, text: "Смотрим счета...", duration: 2000 },
  { key: "balance", icon: Coins, text: "Изучаем баланс...", duration: 2000 },
];

export default function BankConnecting({ onComplete, onError }: BankConnectingProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let errorTimeoutId: NodeJS.Timeout;

    const stage = stages[currentStage];
    if (!stage) {
      // All stages complete - decide success or error (90% success rate)
      const shouldSucceed = Math.random() > 0.1;
      if (shouldSucceed) {
        onComplete();
      } else {
        onError();
      }
      return;
    }

    // Fade out before next stage
    timeoutId = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        setFadeOut(false);
      }, 300);
    }, stage.duration);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(errorTimeoutId);
    };
  }, [currentStage, onComplete, onError]);

  const stage = stages[currentStage];
  if (!stage) return null;

  const Icon = stage.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className={`mb-8 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-primary/10">
              <Icon className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Подключаем банк</h2>
          <p className="text-muted-foreground">{stage.text}</p>
        </div>
      </div>
    </div>
  );
}
