import BankSelection from '../BankSelection'

export default function BankSelectionExample() {
  return (
    <BankSelection 
      onBack={() => console.log('Back clicked')}
      onNext={(banks) => console.log('Selected banks:', banks)}
    />
  )
}
