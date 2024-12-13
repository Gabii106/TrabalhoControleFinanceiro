'use client';

import { useEffect, useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, BarChart2 } from 'lucide-react';
import { db } from '../../firebase';
import { useAuth } from './hooks/userAuth';
import { redirect } from 'next/navigation';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Home() {
  const { user, loading } = useAuth();
  const [monthSummary, setMonthSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'movimentos'), (snapshot) => {
      let totalRevenue = 0;
      let totalExpenses = 0;
      let fixedExpenses = 0;
      let variableExpenses = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const value = data.valor || 0;

        switch (data.tipo) {
          case 'receita':
            totalRevenue += value;
            break;
          case 'despesa_fixa':
            fixedExpenses += value;
            totalExpenses += value;
            break;
          case 'despesa_variavel':
            variableExpenses += value;
            totalExpenses += value;
            break;
          default:
            break;
        }
      });

      setMonthSummary({
        totalRevenue,
        totalExpenses,
        fixedExpenses,
        variableExpenses,
      });
    });

    return () => unsubscribe();
  }, []);

    // Redireciona se o usuário não estiver logado
    useEffect(() => {
      if (!loading && !user) {
        redirect('/login');
      }
    }, [user, loading]);

  const stats = [
    { title: 'Receitas', value: monthSummary.totalRevenue, icon: ArrowUpCircle, color: 'text-green-600' },
    { title: 'Despesas', value: monthSummary.totalExpenses, icon: ArrowDownCircle, color: 'text-red-600' },
    { title: 'Despesas Fixas', value: monthSummary.fixedExpenses, icon: DollarSign, color: 'text-blue-600' },
    { title: 'Despesas Variáveis', value: monthSummary.variableExpenses, icon: BarChart2, color: 'text-yellow-600' },
  ];

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
              R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
