interface MetricasCardsProps {
  leadsHoje: number;
  negociosHoje: number;
  anomaliasPendentes: number;
}

export default function MetricasCards({ leadsHoje, negociosHoje, anomaliasPendentes }: MetricasCardsProps) {
  const taxaConversao = leadsHoje > 0 ? ((negociosHoje / leadsHoje) * 100).toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-500">Leads Hoje</div>
        <div className="mt-2 text-3xl font-bold text-gray-900">{leadsHoje}</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-500">Negócios Hoje</div>
        <div className="mt-2 text-3xl font-bold text-gray-900">{negociosHoje}</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-500">Taxa Conversão</div>
        <div className="mt-2 text-3xl font-bold text-gray-900">{taxaConversao}%</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-500">Anomalias Pendentes</div>
        <div className="mt-2 text-3xl font-bold text-red-600">{anomaliasPendentes}</div>
      </div>
    </div>
  );
}
