'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import dayjs from 'dayjs'; // Biblioteca para manipulação de datas

export default function CadastroMovimentacao() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    valor: '',
    data: '',
    mesesFixos: '1',
    situacao: 'pago',
  });

  // Atualiza os valores do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lida com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação básica
    if (!formData.descricao || !formData.valor || !formData.data) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const movimentosRef = collection(db, 'movimentos');
      const valorNumerico = parseFloat(formData.valor);

      // Se for despesa fixa, cria múltiplos documentos
      if (formData.tipo === 'despesa_fixa') {
        const meses = parseInt(formData.mesesFixos, 10);
        const dataInicial = dayjs(formData.data);

        for (let i = 0; i < meses; i++) {
          const dataAtual = dataInicial.add(i, 'month').format('YYYY-MM-DD');
          await addDoc(movimentosRef, {
            tipo: formData.tipo,
            descricao: formData.descricao,
            valor: valorNumerico,
            data: dataAtual,
            situacao: formData.situacao,
          });
        }

        alert(`Despesa fixa cadastrada para ${meses} meses!`);
      } else {
        // Para outros tipos, insere um único documento
        await addDoc(movimentosRef, {
          tipo: formData.tipo,
          descricao: formData.descricao,
          valor: valorNumerico,
          data: formData.data,
          situacao: formData.tipo.startsWith('despesa') ? formData.situacao : '',
        });

        alert('Movimentação cadastrada com sucesso!');
      }

      router.push('/'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao cadastrar movimentação:', error);
      alert('Erro ao cadastrar movimentação. Tente novamente.');
    }
  };

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

        {formData.tipo === 'despesa_fixa' && (
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
  );
}
