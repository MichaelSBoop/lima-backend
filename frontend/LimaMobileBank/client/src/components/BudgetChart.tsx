import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Line, LineChart, ReferenceLine } from "recharts";

interface BudgetChartProps {
  data: { day: number; amount: number }[];
  spent: number;
  budget: number;
  category: string;
}

export default function BudgetChart({ data, spent, budget, category }: BudgetChartProps) {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Combine spending data with budget reference line
  const chartData = data.map(item => ({
    ...item,
    budget: budget,
  }));

  return (
    <div className="w-full" data-testid="budget-chart">
      <div className="mb-4">
        <div className="text-sm text-muted-foreground mb-1">Потрачено на {category.toLowerCase()}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold tabular-nums">
            {formatAmount(spent)}<span className="text-sm">₽</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#colorSpent)" 
            />
            <ReferenceLine 
              y={budget} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
