'use client';

import { useAuth } from '../hooks/userAuth';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function PerfilUser() {
  const { user, loading } = useAuth();

  // Redireciona para login se o usuário não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      redirect('/login');
    }
  }, [user, loading]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null; // Não renderiza nada até redirecionar
  }

  // Garantir campos existentes no objeto do usuário
  const userInfo = {
    nome: user?.email.split('@')[0] || 'Usuário', // Usa o prefixo do email como nome padrão
    email: user?.email || 'Email não disponível',
    dataRegistro: (user as any)?.metadata?.creationTime || 'Data de registro não disponível',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Perfil do Usuário</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Informações Pessoais</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Nome</h3>
            <p className="text-gray-700">{userInfo.nome}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Email</h3>
            <p className="text-gray-700">{userInfo.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Data de Registro</h3>
            <p className="text-gray-700">{userInfo.dataRegistro}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
