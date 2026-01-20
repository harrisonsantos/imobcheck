'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import AnomaliasList from './AnomaliasList';
import MetricasCards from './MetricasCards';
import CorretoresList from './CorretoresList';
import LeadsList from './LeadsList';
import NegociosList from './NegociosList';
import LogoutButton from './LogoutButton';
import { TendenciasChart, TaxaConversaoChart, AnomaliasPorTipoChart, TopCorretoresChart, ValorVendasChart } from './Charts';
import { DashboardFilters, SearchBar, FilterValues } from './Filters';
import { ExportButtons } from './ExportReports';
import { RealtimeNotifications, OnlineStatusBadge } from './RealtimeNotifications';

interface DashboardData {
  anomalias: any[];
  corretores: any[];
  leads: any[];
  negocios: any[];
  metricas: {
    leadsHoje: number;
    negociosHoje: number;
    anomaliasPendentes: number;
  };
}

export default function DashboardContentEnhanced({ initialData }: { initialData: DashboardData }) {
  const [showCharts, setShowCharts] = useState(true);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'negocios' | 'anomalias' | 'corretores'>('overview');
  
  const supabase = createClient();

  // Dados mock para gráficos (em produção, viriam do banco)
  const tendenciasData = [
    { data: '01/01', leads: 12, negocios: 3, taxa_conversao: 25 },
    { data: '02/01', leads: 15, negocios: 4, taxa_conversao: 26.7 },
    { data: '03/01', leads: 10, negocios: 2, taxa_conversao: 20 },
    { data: '04/01', leads: 18, negocios: 5, taxa_conversao: 27.8 },
    { data: '05/01', leads: 20, negocios: 6, taxa_conversao: 30 },
    { data: '06/01', leads: 14, negocios: 4, taxa_conversao: 28.6 },
    { data: '07/01', leads: 16, negocios: 5, taxa_conversao: 31.3 },
  ];

  const anomaliasPorTipo = [
    { tipo: 'Lead Perdido Rápido', quantidade: 5 },
    { tipo: 'Taxa Conversão Baixa', quantidade: 3 },
    { tipo: 'Venda Não Registrada', quantidade: 2 },
    { tipo: 'Lead Inativo', quantidade: 8 },
    { tipo: 'Negócio Data Futura', quantidade: 1 },
  ];

  const topCorretores = initialData.corretores.slice(0, 10).map(c => ({
    nome: c.nome,
    negocios: Math.floor(Math.random() * 20) + 1,
    valor_total: Math.floor(Math.random() * 1000000) + 100000,
  }));

  const valorVendas = [
    { mes: 'Jul', valor_total: 1500000 },
    { mes: 'Ago', valor_total: 1800000 },
    { mes: 'Set', valor_total: 1600000 },
    { mes: 'Out', valor_total: 2200000 },
    { mes: 'Nov', valor_total: 2500000 },
    { mes: 'Dez', valor_total: 2100000 },
  ];

  const handleFilterChange = (filters: FilterValues) => {
    // Implementar filtragem real aqui
    console.log('Filtros aplicados:', filters);
    // Por enquanto, mantém os dados originais
    setFilteredData(initialData);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implementar busca real aqui
    console.log('Busca:', query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0C0F24] to-[#1B489B] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard de Auditoria</h1>
              <p className="text-gray-200 text-sm">eXp Realty Brasil - ImobCheck</p>
            </div>
            <div className="flex items-center gap-4">
              <OnlineStatusBadge />
              <RealtimeNotifications />
              <button
                onClick={() => setShowCharts(!showCharts)}
                className="px-4 py-2 bg-white text-[#0C0F24] rounded-md hover:bg-gray-100 transition-colors text-sm font-semibold"
              >
                {showCharts ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Cards */}
        <MetricasCards
          leadsHoje={filteredData.metricas.leadsHoje}
          negociosHoje={filteredData.metricas.negociosHoje}
          anomaliasPendentes={filteredData.metricas.anomaliasPendentes}
        />

        {/* Gráficos de Tendências */}
        {showCharts && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-[#0C0F24] mb-6">Análises e Tendências</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <TendenciasChart data={tendenciasData} />
              <TaxaConversaoChart data={tendenciasData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <AnomaliasPorTipoChart data={anomaliasPorTipo} />
              <TopCorretoresChart data={topCorretores} />
            </div>

            <div className="mb-6">
              <ValorVendasChart data={valorVendas} />
            </div>
          </div>
        )}

        {/* Filtros */}
        <DashboardFilters 
          onFilterChange={handleFilterChange}
          corretores={filteredData.corretores}
        />

        {/* Tabs de Navegação */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-[#1B489B] text-[#1B489B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('anomalias')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'anomalias'
                    ? 'border-[#1B489B] text-[#1B489B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Anomalias ({filteredData.anomalias.length})
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'leads'
                    ? 'border-[#1B489B] text-[#1B489B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leads ({filteredData.leads.length})
              </button>
              <button
                onClick={() => setActiveTab('negocios')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'negocios'
                    ? 'border-[#1B489B] text-[#1B489B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Negócios ({filteredData.negocios.length})
              </button>
              <button
                onClick={() => setActiveTab('corretores')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'corretores'
                    ? 'border-[#1B489B] text-[#1B489B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Corretores ({filteredData.corretores.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Anomalias Pendentes</h2>
                <ExportButtons data={filteredData.anomalias} filename="anomalias" type="anomalias" />
              </div>
              <AnomaliasList anomalias={filteredData.anomalias.slice(0, 10)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Leads Recentes</h2>
                <LeadsList leads={filteredData.leads.slice(0, 10)} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Negócios Recentes</h2>
                <NegociosList negocios={filteredData.negocios.slice(0, 10)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'anomalias' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <SearchBar onSearch={handleSearch} placeholder="Buscar anomalias..." />
              <ExportButtons data={filteredData.anomalias} filename="anomalias" type="anomalias" />
            </div>
            <AnomaliasList anomalias={filteredData.anomalias} />
          </div>
        )}

        {activeTab === 'leads' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <SearchBar onSearch={handleSearch} placeholder="Buscar leads..." />
              <ExportButtons data={filteredData.leads} filename="leads" type="leads" />
            </div>
            <LeadsList leads={filteredData.leads} />
          </div>
        )}

        {activeTab === 'negocios' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <SearchBar onSearch={handleSearch} placeholder="Buscar negócios..." />
              <ExportButtons data={filteredData.negocios} filename="negocios" type="negocios" />
            </div>
            <NegociosList negocios={filteredData.negocios} />
          </div>
        )}

        {activeTab === 'corretores' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <SearchBar onSearch={handleSearch} placeholder="Buscar corretores..." />
              <ExportButtons data={filteredData.corretores} filename="corretores" type="corretores" />
            </div>
            <CorretoresList corretores={filteredData.corretores} />
          </div>
        )}
      </div>
    </div>
  );
}
