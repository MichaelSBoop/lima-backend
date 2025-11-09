import FinancialGoalsSelection from '../FinancialGoalsSelection'

export default function FinancialGoalsSelectionExample() {
  return (
    <FinancialGoalsSelection 
      onBack={() => console.log('Back clicked')}
      onNext={(goals) => console.log('Selected goals:', goals)}
    />
  )
}
