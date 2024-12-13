'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, redirect } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { signOut as signOutAuth } from 'firebase/auth';
import { signOut as signOutNextAuth } from 'next-auth/react';
import { auth } from '../../../firebase';

const menuItems = [
  { href: '/', label: 'Início' },
  { href: '/cadastro', label: 'Cadastro de Movimentação' },
  { href: '/movimentacoes', label: 'Ver Movimentação' },
  { href: '/relatorios', label: 'Relatórios' },
  { href: '/perfilUser', label: 'Perfil'},
  { href: '', label: 'Logout' }, // Deixe o href vazio para o botão de logout
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Logout do Firebase
      await signOutAuth(auth);

      // Logout do NextAuth
      await signOutNextAuth();

      // Redireciona para a página de login
      redirect('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold">
            FinanceApp
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className="hidden lg:flex space-x-4">
            {menuItems.map((item) => {
              if (item.label === 'Logout') {
                return (
                  <button
                    key={item.label}
                    onClick={handleLogout}
                    className="hover:text-blue-200"
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-blue-200 ${
                    pathname === item.href ? 'font-bold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="lg:hidden">
          {menuItems.map((item) => {
            if (item.label === 'Logout') {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block py-2 px-4 hover:bg-blue-700"
                >
                  {item.label}
                </button>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 px-4 hover:bg-blue-700 ${
                  pathname === item.href ? 'font-bold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
