'use client';

import { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  corretores: Array<{ id: string; nome: string }>;
}

export interface FilterValues {
  dataInicio: string;
  dataFim: string;
  corretorId: string;
  status: string;
  tipo: string;
}

export function DashboardFilters({ onFilterChange, corretores }: FilterProps) {
  const hoje = new Date().toISOString().split('T')[0];
  const trintaDiasAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [filters, setFilters] = useState<FilterValues>({
    dataInicio: trintaDiasAtras,
    dataFim: hoje,
    corretorId: '',
    status: '',
    tipo: '',
  });

  const handleChange = (field: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      dataInicio: trintaDiasAtras,
      dataFim: hoje,
      corretorId: '',
      status: '',
      tipo: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#0C0F24]">Filtros</h3>
        <button
          onClick={handleReset}
          className="text-sm text-[#1B489B] hover:text-[#0C0F24] font-semibold"
        >
          Limpar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Data Início */}
        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
            Data Início
          </label>
          <input
            type="date"
            id="dataInicio"
            value={filters.dataInicio}
            onChange={(e) => handleChange('dataInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
          />
        </div>

        {/* Data Fim */}
        <div>
          <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
            Data Fim
          </label>
          <input
            type="date"
            id="dataFim"
            value={filters.dataFim}
            onChange={(e) => handleChange('dataFim', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
          />
        </div>

        {/* Corretor */}
        <div>
          <label htmlFor="corretor" className="block text-sm font-medium text-gray-700 mb-1">
            Corretor
          </label>
          <select
            id="corretor"
            value={filters.corretorId}
            onChange={(e) => handleChange('corretorId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
          >
            <option value="">Todos</option>
            {corretores.map((corretor) => (
              <option key={corretor.id} value={corretor.id}>
                {corretor.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
          >
            <option value="">Todos</option>
            <option value="novo">Novo</option>
            <option value="contatado">Contatado</option>
            <option value="em_negociacao">Em Negociação</option>
            <option value="ganho">Ganho</option>
            <option value="perdido">Perdido</option>
          </select>
        </div>

        {/* Tipo de Anomalia */}
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Anomalia
          </label>
          <select
            id="tipo"
            value={filters.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
          >
            <option value="">Todos</option>
            <option value="lead_perdido_rapido">Lead Perdido Rápido</option>
            <option value="taxa_conversao_baixa">Taxa Conversão Baixa</option>
            <option value="venda_nao_registrada">Venda Não Registrada</option>
            <option value="lead_inativo">Lead Inativo</option>
            <option value="negocio_data_futura">Negócio Data Futura</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function SearchBar({ onSearch, placeholder = "Buscar..." }: { onSearch: (query: string) => void; placeholder?: string }) {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
