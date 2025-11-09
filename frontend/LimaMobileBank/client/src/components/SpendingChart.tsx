import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface SpendingChartProps {
  data: { day: number; amount: number }[];
  total: number;
  change: number;
}

export default function SpendingChart({ data, total, change }: SpendingChartProps) {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="w-full" data-testid="spending-chart">
      <div className="mb-4">
        <div className="text-sm text-muted-foreground mb-1">Потрачено в ноябре</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold tabular-nums">{formatAmount(total)}<span className="text-sm">₽</span></div>
          <div className="text-sm text-muted-foreground">{formatAmount(change)}₽</div>
        </div>
      </div>
      
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis hide />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
