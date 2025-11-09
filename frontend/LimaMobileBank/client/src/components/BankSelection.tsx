import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Building2, Info } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Bank {
  id: string;
  name: string;
  color: string;
}

const banks: Bank[] = [
  { id: "ozon", name: "Озон банк", color: "bg-blue-600" },
  { id: "tbank", name: "Т-Банк", color: "bg-yellow-500" },
  { id: "vtb", name: "ВТБ", color: "bg-blue-700" },
  { id: "alfa", name: "Альфа-Банк", color: "bg-red-600" },
  { id: "sber", name: "Сбер", color: "bg-green-600" },
];

interface BankSelectionProps {
  onBack: () => void;
  onNext: (selectedBank: string) => void;
}

export default function BankSelection({ onBack, onNext }: BankSelectionProps) {
  const [selectedBank, setSelectedBank] = useState<string>("");

  const handleConnect = () => {
    if (selectedBank) {
      onNext(selectedBank);
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
        <h2 className="text-lg font-semibold">Подключите банк</h2>
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        <RadioGroup value={selectedBank} onValueChange={setSelectedBank} className="space-y-2">
          {banks.map(bank => (
            <div key={bank.id} className="flex items-center space-x-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors">
              <div className={`p-2 rounded-full ${bank.color} flex items-center justify-center flex-shrink-0`}>
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <Label htmlFor={bank.id} className="flex-1 font-medium cursor-pointer">
                {bank.name}
              </Label>
              <RadioGroupItem value={bank.id} id={bank.id} />
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="p-6 max-w-md mx-auto w-full space-y-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Как подключить банк в ручную</span>
        </div>
        <Button
          onClick={handleConnect}
          disabled={!selectedBank}
          className={`w-full h-12 rounded-xl font-semibold transition-all ${
            selectedBank 
              ? 'bg-primary hover:bg-primary/90' 
              : 'bg-primary/50 cursor-not-allowed'
          }`}
          data-testid="button-connect"
        >
          Подключить
        </Button>
      </div>
    </div>
  );
}
