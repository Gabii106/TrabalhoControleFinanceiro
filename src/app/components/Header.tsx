'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const menuItems = [
  { href: '/', label: 'Início' },
  { href: '/cadastro', label: 'Cadastro de Movimentação' },
  { href: '/movimentacoes', label: 'Ver Movimentação' },
  { href: '/relatorios', label: 'Relatórios' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

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
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-blue-200 ${
                  pathname === item.href ? 'font-bold' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="lg:hidden">
          {menuItems.map((item) => (
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
          ))}
        </nav>
      )}
    </header>
  )
}

