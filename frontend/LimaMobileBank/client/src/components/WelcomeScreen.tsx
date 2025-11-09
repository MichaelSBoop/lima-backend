import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" strokeWidth={2.5} />
            <h1 className="text-4xl font-bold text-foreground">Lima</h1>
          </div>
          <p className="text-muted-foreground text-center text-sm">
            Все банковские счета<br />в одном приложении
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <Button 
          onClick={onNext}
          className="w-full h-12 rounded-xl font-semibold"
          data-testid="button-start"
        >
          Начать
        </Button>
        <div className="mt-4 h-1 bg-muted rounded-full" />
      </div>
    </div>
  );
}
