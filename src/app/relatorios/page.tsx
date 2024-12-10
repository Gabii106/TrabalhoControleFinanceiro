'use client';

import { useState, useEffect } from 'react';


export default function Realtorios(){
    const [filtro, setFiltro] = useState('todos');

    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Relatório</h1>
    
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
                
              </tbody>
            </table>
          </div>
        </div>
      );
}