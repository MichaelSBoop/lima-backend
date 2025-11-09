import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Coins, CreditCard, Loader2 } from "lucide-react";
import { Building2 } from "lucide-react";

interface Bank {
  id: string;
  name: string;
  color: string;
}

interface BankPermissionsProps {
  bank: Bank;
  onBack: () => void;
  onConnect: () => void;
  isConnecting?: boolean;
}

export default function BankPermissions({ bank, onBack, onConnect, isConnecting = false }: BankPermissionsProps) {
  const permissions = [
    {
      icon: BarChart3,
      title: "История транзакций",
      description: "Доступ к истории ваших операций"
    },
    {
      icon: Coins,
      title: "Баланс",
      description: "Информация о текущем балансе"
    },
    {
      icon: CreditCard,
      title: "Счета",
      description: "Список ваших счетов и карт"
    }
  ];

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
        <div className="mb-8">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
            <div className={`p-2 rounded-full ${bank.color} flex items-center justify-center`}>
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="font-medium">{bank.name}</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold mb-4">
            К какой информации мы хотим иметь доступ:
          </h3>
          <div className="space-y-3">
            {permissions.map((permission, index) => {
              const Icon = permission.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border"
                >
                  <div className="p-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{permission.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto w-full">
        <Button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90"
          data-testid="button-connect"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Подключение...
            </>
          ) : (
            "Подключить"
          )}
        </Button>
      </div>
    </div>
  );
}
