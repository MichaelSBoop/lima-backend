import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface BankConnectionErrorProps {
  onBack: () => void;
  onRetry: () => void;
}

export default function BankConnectionError({ onBack, onRetry }: BankConnectionErrorProps) {
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
        <h2 className="text-lg font-semibold">Подключаем банк</h2>
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Не удалось подключить</h2>
          <div className="flex items-start gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-destructive" />
            <span className="text-destructive">
              Не удалось подключить банк. Попробуйте ещё раз позже
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto w-full">
        <Button
          onClick={onRetry}
          className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90"
          data-testid="button-retry"
        >
          Подключить
        </Button>
      </div>
    </div>
  );
}
