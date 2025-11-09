import SpendingChart from '../SpendingChart'

const mockData = [
  { day: 1, amount: 800 },
  { day: 6, amount: 1200 },
  { day: 11, amount: 1500 },
  { day: 16, amount: 1800 },
  { day: 21, amount: 2100 },
  { day: 26, amount: 2450.31 },
  { day: 30, amount: 2450.31 },
];

export default function SpendingChartExample() {
  return (
    <div className="p-6 max-w-md">
      <SpendingChart data={mockData} total={2450.31} change={34825.88} />
    </div>
  )
}
