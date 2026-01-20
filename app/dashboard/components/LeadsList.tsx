interface Lead {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  origem: string | null;
  status: string;
  valor_proposta: number | null;
  created_at: string;
  corretores?: {
    nome: string;
  } | null;
  imoveis?: {
    endereco: string | null;
  } | null;
}

interface LeadsListProps {
  leads: Lead[];
}

export default function LeadsList({ leads }: LeadsListProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Nenhum lead encontrado
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {leads.map((lead) => (
          <div key={lead.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{lead.nome || 'Sem nome'}</div>
                <div className="text-sm text-gray-500">{lead.email || lead.telefone || 'Sem contato'}</div>
                {lead.corretores && (
                  <div className="text-xs text-gray-400">Corretor: {lead.corretores.nome}</div>
                )}
                {lead.imoveis?.endereco && (
                  <div className="text-xs text-gray-400">Imóvel: {lead.imoveis.endereco}</div>
                )}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {lead.status}
                </span>
                {lead.valor_proposta && (
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    R$ {lead.valor_proposta.toLocaleString('pt-BR')}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {new Date(lead.created_at).toLocaleString('pt-BR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
