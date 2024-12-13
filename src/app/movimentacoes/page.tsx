'use client';

import { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, XCircle } from 'lucide-react';
import { db } from '../../../firebase';
import { useAuth } from '../hooks/userAuth';
import { redirect } from 'next/navigation';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

interface Movimento {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  data: string;
  situacao: string;
}

export default function VerMovimentacoes() {
  const { user, loading } = useAuth();

    // Redireciona se o usuário não estiver logado
    useEffect(() => {
      if (!loading && !user) {
        redirect('/login');
      }
    }, [user, loading]);

  const [movimentos, setMovimentos] = useState<Movimento[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [editingTransaction, setEditingTransaction] = useState<Movimento | null>(null);

  // Carrega as movimentações do Firestore
  useEffect(() => {
    const fetchTransactions = async () => {
      const querySnapshot = await getDocs(collection(db, 'movimentos'));
      const fetchedMovimentos: Movimento[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Movimento, 'id'>),
      }));

      setMovimentos(fetchedMovimentos);
    };

    fetchTransactions();
  }, []);

  // Filtra as movimentações com base no filtro selecionado
  const transacoesFiltradas = movimentos.filter((transaction) => {
    if (filtro === 'todos') return true;
    if (filtro === 'receitas') return transaction.tipo === 'receita';
    if (filtro === 'despesas') return transaction.tipo.startsWith('despesa');
    return transaction.situacao === filtro;
  });

  // Exclui uma movimentação
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'movimentos', id));
      setMovimentos((prev) => prev.filter((transaction) => transaction.id !== id));
      alert('Movimentação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir movimentação:', error);
      alert('Erro ao excluir movimentação. Tente novamente.');
    }
  };

  // Salva as alterações de uma movimentação
  const handleEditSave = async () => {
    if (!editingTransaction) return;

    try {
      await updateDoc(doc(db, 'movimentos', editingTransaction.id), {
        ...editingTransaction,
      });
      setMovimentos((prev) =>
        prev.map((transaction) =>
          transaction.id === editingTransaction.id ? editingTransaction : transaction
        )
      );
      alert('Movimentação editada com sucesso!');
      setEditingTransaction(null);
    } catch (error) {
      console.error('Erro ao editar movimentação:', error);
      alert('Erro ao editar movimentação. Tente novamente.');
    }
  };

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
              <th className="p-3 text-left">Ações</th>
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.situacao === 'pago' || transaction.situacao === 'recebido'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {transaction.situacao}
                  </span>
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição */}
      {editingTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Editar Movimentação</h2>
              <button
                onClick={() => setEditingTransaction(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <XCircle size={24} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Descrição</label>
                <input
                  type="text"
                  value={editingTransaction.descricao}
                  onChange={(e) =>
                    setEditingTransaction((prev) =>
                      prev ? { ...prev, descricao: e.target.value } : null
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Valor</label>
                <input
                  type="number"
                  value={editingTransaction.valor}
                  onChange={(e) =>
                    setEditingTransaction((prev) =>
                      prev ? { ...prev, valor: parseFloat(e.target.value) } : null
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Data</label>
                <input
                  type="date"
                  value={editingTransaction.data}
                  onChange={(e) =>
                    setEditingTransaction((prev) =>
                      prev ? { ...prev, data: e.target.value } : null
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* Campo Situação para despesas */}
              {editingTransaction.tipo.startsWith('despesa') && (
                <div>
                  <label className="block font-semibold mb-2">Situação</label>
                  <select
                    value={editingTransaction.situacao}
                    onChange={(e) =>
                      setEditingTransaction((prev) =>
                        prev ? { ...prev, situacao: e.target.value } : null
                      )
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                  </select>
                </div>
              )}
              <button
                type="button"
                onClick={handleEditSave}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
