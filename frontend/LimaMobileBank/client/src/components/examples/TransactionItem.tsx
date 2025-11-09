import TransactionItem from '../TransactionItem'

export default function TransactionItemExample() {
  return (
    <div className="p-6 max-w-md">
      <div className="divide-y">
        <TransactionItem merchant="Вкусно и точка" category="Еда" amount={140} />
        <TransactionItem merchant="Золотое яблоко" category="Косметика" amount={2940} />
        <TransactionItem merchant="ВкусВилл" category="Еда" amount={480} />
      </div>
    </div>
  )
}
