"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

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
  const [transactions, setTransactions] = useState<Movimento[]>([]);
  const [filter, setFilter] = useState({
    type: '',
    status: '',
    period: 'monthly',
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

  const filteredData = transactions.filter((transaction) => {
    if (filter.type && transaction.tipo !== filter.type) return false;
    if (filter.status && transaction.situacao !== filter.status) return false;
    return true;
  });

  const updateChartData = (data: Movimento[]) => {
    const groupedByType = data.reduce(
      (acc, curr) => {
        acc[curr.tipo] = (acc[curr.tipo] || 0) + (curr.valor || 0);
        return acc;
      },
      {} as Record<string, number>
    );

    setChartData({
      labels: Object.keys(groupedByType),
      datasets: [
        {
          label: 'Valores',
          data: Object.values(groupedByType),
          backgroundColor: ['#4CAF50', '#F44336', '#2196F3', '#FFC107'],
        },
      ],
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Descrição', 'Tipo', 'Valor', 'Situação']],
      body: filteredData.map(({ descricao, tipo, valor, situacao }) => [
        descricao,
        tipo,
        `R$ ${valor.toFixed(2)}`,
        situacao,
      ]),
    });
    doc.save('relatorio.pdf');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>

      <div className="mb-6">
        <select
          className="border rounded p-2 mr-4"
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="">Todos os Tipos</option>
          <option value="receita">Receita</option>
          <option value="despesa_fixa">Despesa Fixa</option>
          <option value="despesa_variavel">Despesa Variável</option>
        </select>

        <select
          className="border rounded p-2 mr-4"
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">Todos os Status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
        </select>

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

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Descrição</th>
            <th className="border border-gray-300 p-2">Tipo</th>
            <th className="border border-gray-300 p-2">Valor</th>
            <th className="border border-gray-300 p-2">Situação</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(({ id, descricao, tipo, valor, situacao }) => (
            <tr key={id}>
              <td className="border border-gray-300 p-2">{descricao}</td>
              <td className="border border-gray-300 p-2">{tipo}</td>
              <td className="border border-gray-300 p-2">
                R$ {valor.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2">{situacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
