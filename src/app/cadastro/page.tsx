'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CadastroMovimentacao() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    valor: '',
    data: '',
    mesesFixos: '1',
    situacao: 'pago',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log(formData)
    // Redirect to the dashboard after submission
    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cadastro de Movimentação</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tipo" className="block mb-2 font-semibold">
            Tipo de Movimentação
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="receita">Receita</option>
            <option value="despesa_fixa">Despesa Fixa</option>
            <option value="despesa_variavel">Despesa Variável</option>
          </select>
        </div>

        {formData.tipo.startsWith('despesa_fixa') && (
          <div>
            <label htmlFor="mesesFixos" className="block mb-2 font-semibold">
              Meses (para despesas fixas)
            </label>
            <input
              type="number"
              id="mesesFixos"
              name="mesesFixos"
              value={formData.mesesFixos}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div>
          <label htmlFor="descricao" className="block mb-2 font-semibold">
            Descrição
          </label>
          <input
            type="text"
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="valor" className="block mb-2 font-semibold">
            Valor
          </label>
          <input
            type="number"
            id="valor"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="data" className="block mb-2 font-semibold">
            Data da Movimentação
          </label>
          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {formData.tipo.startsWith('despesa') && (
          <div>
          <label htmlFor="dataPagamento" className="block mb-2 font-semibold">
            Data de Pagamento
          </label>
          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
          )}

        {formData.tipo.startsWith('despesa') && (
          <div>
            <label htmlFor="situacao" className="block mb-2 font-semibold">
              Situação
            </label>
            <select
              id="situacao"
              name="situacao"
              value={formData.situacao}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Cadastrar Movimentação
        </button>
      </form>
    </div>
  )
}

