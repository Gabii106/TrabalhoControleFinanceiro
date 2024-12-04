import { ArrowUpCircle, ArrowDownCircle, DollarSign, BarChart2 } from 'lucide-react'

export default function Home() {
  // Mock data (replace with actual data fetching logic)
  const monthSummary = {
    totalRevenue: 5000,
    totalExpenses: 3500,
    fixedExpenses: 2000,
    variableExpenses: 1500,
  }

  const stats = [
    { title: 'Receitas', value: monthSummary.totalRevenue, icon: ArrowUpCircle, color: 'text-green-600' },
    { title: 'Despesas', value: monthSummary.totalExpenses, icon: ArrowDownCircle, color: 'text-red-600' },
    { title: 'Despesas Fixas', value: monthSummary.fixedExpenses, icon: DollarSign, color: 'text-blue-600' },
    { title: 'Despesas Variáveis', value: monthSummary.variableExpenses, icon: BarChart2, color: 'text-yellow-600' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <item.icon className={`${item.color} h-8 w-8`} />
            </div>
            <p className={`${item.color} text-2xl font-bold`}>
              R$ {item.value.toLocaleString('pt-BR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

