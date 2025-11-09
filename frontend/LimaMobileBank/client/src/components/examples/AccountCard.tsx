import AccountCard from '../AccountCard'

export default function AccountCardExample() {
  return (
    <div className="p-6 space-y-3 max-w-md">
      <AccountCard bankName="Озон Банк" balance={1146.28} color="bg-blue-600" />
      <AccountCard bankName="Т-Банк" balance={28204.43} color="bg-yellow-500" />
      <AccountCard bankName="ВТБ" balance={6982.12} color="bg-blue-700" />
    </div>
  )
}
