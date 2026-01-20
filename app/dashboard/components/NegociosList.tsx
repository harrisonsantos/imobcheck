interface Negocio {
  id: string;
  valor_venda: number | null;
  comissao_valor: number | null;
  data_fechamento: string | null;
  status: string;
  created_at: string;
  corretores?: {
    nome: string;
  } | null;
  imoveis?: {
    endereco: string | null;
  } | null;
  leads?: {
    nome: string | null;
  } | null;
}

interface NegociosListProps {
  negocios: Negocio[];
}

export default function NegociosList({ negocios }: NegociosListProps) {
  if (negocios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Nenhum negócio encontrado
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Corretor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imóvel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comissão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Fechamento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {negocios.map((negocio) => (
              <tr key={negocio.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {negocio.corretores?.nome || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {negocio.imoveis?.endereco || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {negocio.leads?.nome || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {negocio.valor_venda
                    ? `R$ ${negocio.valor_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {negocio.comissao_valor
                    ? `R$ ${negocio.comissao_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {negocio.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {negocio.data_fechamento
                    ? new Date(negocio.data_fechamento).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
