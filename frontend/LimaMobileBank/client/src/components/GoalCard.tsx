import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
  name: string;
  target: number;
  current: number;
  startDate: Date;
  endDate: Date;
}

export default function GoalCard({ name, target, current, startDate, endDate }: GoalCardProps) {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const progress = Math.min((current / target) * 100, 100);
  
  // Format date range like "Фев 17-24"
  const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const startMonth = monthNames[startDate.getMonth()];
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const dateRange = `${startMonth} ${startDay}-${endDay}`;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">{dateRange}</div>
          <div className="font-semibold text-base">{name}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatAmount(current)}₽</span>
          <span className="text-sm text-muted-foreground">из {formatAmount(target)}₽</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </Card>
  );
}
