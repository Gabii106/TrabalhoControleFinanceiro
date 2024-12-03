'use client'

import { useState } from 'react'
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

// Mock data
const mockTransactions = [
  { id: 1, tipo: 'receita', descricao: 'Salário', valor: 5000, data: '2023-05-01', situacao: 'recebido' },
  { id: 2, tipo: 'despesa_fixa', descricao: 'Aluguel', valor: 1500, data: '2023-05-05', situacao: 'pago' },
  { id: 3, tipo: 'despesa_variavel', descricao: 'Supermercado', valor: 800, data: '2023-05-10', situacao: 'pago' },
  { id: 4, tipo: 'despesa_variavel', descricao: 'Conta de luz', valor: 200, data: '2023-05-15', situacao: 'pendente' },
  { id: 5, tipo: 'receita', descricao: 'Freelance', valor: 1000, data: '2023-05-20', situacao: 'recebido' },
]

export default function VerMovimentacoes() {
  const [filtro, setFiltro] = useState('todos')

  const transacoesFiltradas = mockTransactions.filter(transaction => {
    if (filtro === 'todos') return true
    if (filtro === 'receitas') return transaction.tipo === 'receita'
    if (filtro === 'despesas') return transaction.tipo.startsWith('despesa')
    return transaction.situacao === filtro
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ver Movimentações</h1>
      
      <div className="mb-4">
        <label htmlFor="filtro" className="mr-2">Filtrar por:</label>
        <select
          id="filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="todos">Todos</option>
          <option value="receitas">Receitas</option>
          <option value="despesas">Despesas</option>
          <option value="pago">Pagos</option>
          <option value="pendente">Pendentes</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Descrição</th>
              <th className="p-3 text-left">Valor</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Situação</th>
            </tr>
          </thead>
          <tbody>
            {transacoesFiltradas.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-100">
                <td className="p-3">
                  {transaction.tipo === 'receita' ? (
                    <ArrowUpCircle className="text-green-500" />
                  ) : (
                    <ArrowDownCircle className="text-red-500" />
                  )}
                </td>
                <td className="p-3">{transaction.descricao}</td>
                <td className="p-3">R$ {transaction.valor.toFixed(2)}</td>
                <td className="p-3">{new Date(transaction.data).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.situacao === 'pago' || transaction.situacao === 'recebido'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {transaction.situacao}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

