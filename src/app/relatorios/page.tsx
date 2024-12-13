"use client";

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';
import { useAuth } from '../hooks/userAuth';
import { redirect } from 'next/navigation';

// Interface Movimento para tipagem
interface Movimento {
  id?: string;
  tipo: 'receita' | 'despesa_fixa' | 'despesa_variavel';
  descricao: string;
  valor: number;
  data: string; // ISO 8601
  situacao: 'pago' | 'pendente';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

export default function Reports() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Movimento[]>([]);
  const [filter, setFilter] = useState({
    type: '',
    status: '',
    period: 'monthly',
    month: dayjs().format('MM'),
    year: dayjs().format('YYYY'),
  });

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Valores',
        data: [],
        backgroundColor: ['#4CAF50', '#F44336', '#2196F3', '#FFC107'],
      },
    ],
  });

  useEffect(() => {
    const q = query(collection(db, 'movimentos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Movimento[];
      setTransactions(data);
      updateChartData(data);
    });

    return () => unsubscribe();
  }, []);

    // Redireciona se o usuário não estiver logado
    useEffect(() => {
      if (!loading && !user) {
        redirect('/login');
      }
    }, [user, loading]);

  const filteredData = transactions.filter((transaction) => {
    if (filter.type && transaction.tipo !== filter.type) return false;
    if (filter.status && transaction.situacao !== filter.status) return false;

    const transactionDate = dayjs(transaction.data);

    if (filter.period === 'monthly') {
      return (
        transactionDate.format('MM') === filter.month &&
        transactionDate.format('YYYY') === filter.year
      );
    }

    if (filter.period === 'yearly') {
      return transactionDate.format('YYYY') === filter.year;
    }

    return true;
  });

  const updateChartData = (data: Movimento[]) => {
    const groupedData = data.reduce((acc, curr) => {
      const date = dayjs(curr.data);
      const key =
        filter.period === 'monthly'
          ? date.format('YYYY-MM')
          : date.format('YYYY');
      acc[key] = (acc[key] || 0) + curr.valor;
      return acc;
    }, {} as Record<string, number>);

    setChartData({
      labels: Object.keys(groupedData),
      datasets: [
        {
          label: 'Valores',
          data: Object.values(groupedData),
          backgroundColor: ['#4CAF50', '#F44336', '#2196F3', '#FFC107'],
        },
      ],
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Descrição', 'Tipo', 'Valor', 'Situação', 'Data']],
      body: filteredData.map(({ descricao, tipo, valor, situacao, data }) => [
        descricao,
        tipo,
        `R$ ${valor.toFixed(2)}`,
        situacao,
        dayjs(data).format('DD/MM/YYYY'),
      ]),
    });
    doc.save('relatorio.pdf');
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded p-2"
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="">Todos os Tipos</option>
          <option value="receita">Receita</option>
          <option value="despesa_fixa">Despesa Fixa</option>
          <option value="despesa_variavel">Despesa Variável</option>
        </select>

        <select
          className="border rounded p-2"
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">Todos os Status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
        </select>

        <select
          className="border rounded p-2"
          onChange={(e) => setFilter({ ...filter, period: e.target.value })}
        >
          <option value="monthly">Mensal</option>
          <option value="yearly">Anual</option>
        </select>

        {filter.period === 'monthly' && (
          <input
            type="number"
            className="border rounded p-2"
            placeholder="Mês (MM)"
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: e.target.value })}
          />
        )}

        <input
          type="number"
          className="border rounded p-2"
          placeholder="Ano (YYYY)"
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: e.target.value })}
        />

        <button
          className="bg-blue-500 text-white rounded p-2"
          onClick={exportToPDF}
        >
          Exportar para PDF
        </button>
      </div>

      <div className="mb-6">
        <Bar data={chartData} />
      </div>

      <div className="overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Descrição</th>
              <th className="border border-gray-300 p-2">Tipo</th>
              <th className="border border-gray-300 p-2">Valor</th>
              <th className="border border-gray-300 p-2">Situação</th>
              <th className="border border-gray-300 p-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(({ id, descricao, tipo, valor, situacao, data }) => (
              <tr key={id}>
                <td className="border border-gray-300 p-2">{descricao}</td>
                <td className="border border-gray-300 p-2">{tipo}</td>
                <td className="border border-gray-300 p-2">
                  R$ {valor.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2">{situacao}</td>
                <td className="border border-gray-300 p-2">{dayjs(data).format('DD/MM/YYYY')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
