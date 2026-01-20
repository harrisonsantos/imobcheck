'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TendenciaData {
  data: string;
  leads: number;
  negocios: number;
  taxa_conversao: number;
}

interface AnomaliasPorTipo {
  tipo: string;
  quantidade: number;
  [key: string]: string | number;
}

interface CorretorPerformance {
  nome: string;
  negocios: number;
  valor_total: number;
}

const COLORS = ['#0C0F24', '#1B489B', '#58595B', '#E2E3E4', '#3B82F6', '#10B981'];

export function TendenciasChart({ data }: { data: TendenciaData[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-[#0C0F24]">Tendências dos Últimos 30 Dias</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" stroke="#58595B" />
          <YAxis stroke="#58595B" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="leads" stroke="#1B489B" strokeWidth={2} name="Leads" />
          <Line type="monotone" dataKey="negocios" stroke="#10B981" strokeWidth={2} name="Negócios" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaxaConversaoChart({ data }: { data: TendenciaData[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-[#0C0F24]">Taxa de Conversão (%)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" stroke="#58595B" />
          <YAxis stroke="#58595B" />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="taxa_conversao" 
            stroke="#1B489B" 
            strokeWidth={3} 
            name="Taxa de Conversão (%)"
            dot={{ fill: '#1B489B', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnomaliasPorTipoChart({ data }: { data: AnomaliasPorTipo[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-[#0C0F24]">Distribuição de Anomalias por Tipo</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.tipo}: ${entry.quantidade}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="quantidade"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopCorretoresChart({ data }: { data: CorretorPerformance[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-[#0C0F24]">Top 10 Corretores por Negócios</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" stroke="#58595B" />
          <YAxis dataKey="nome" type="category" width={120} stroke="#58595B" />
          <Tooltip />
          <Legend />
          <Bar dataKey="negocios" fill="#1B489B" name="Negócios Fechados" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ValorVendasChart({ data }: { data: { mes: string; valor_total: number }[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-[#0C0F24]">Volume de Vendas (Últimos 6 Meses)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" stroke="#58595B" />
          <YAxis stroke="#58595B" />
          <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
          <Legend />
          <Bar dataKey="valor_total" fill="#10B981" name="Valor Total (R$)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
