'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Anomalia {
  id: string;
  tipo: string;
  severidade: 'baixa' | 'media' | 'alta';
  descricao: string;
  created_at: string;
  corretores?: {
    nome: string;
    email: string;
  } | null;
}

interface AnomaliasListProps {
  anomalias: Anomalia[];
}

export default function AnomaliasList({ anomalias }: AnomaliasListProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleResolve = async (id: string) => {
    await supabase
      .from('anomalias')
      .update({ resolvida: true, resolvida_em: new Date().toISOString() })
      .eq('id', id);
    
    router.refresh();
  };

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'alta':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'media':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'baixa':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (anomalias.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Nenhuma anomalia pendente
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {anomalias.map((anomalia) => (
          <div
            key={anomalia.id}
            className={`p-4 border-l-4 ${getSeveridadeColor(anomalia.severidade)}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm uppercase">{anomalia.tipo}</span>
                  <span className="text-xs bg-white px-2 py-1 rounded">
                    {anomalia.severidade}
                  </span>
                </div>
                <p className="mt-1 text-sm">{anomalia.descricao}</p>
                {anomalia.corretores && (
                  <p className="mt-1 text-xs text-gray-600">
                    Corretor: {anomalia.corretores.nome} ({anomalia.corretores.email})
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(anomalia.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => handleResolve(anomalia.id)}
                className="ml-4 px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
              >
                Marcar como Resolvida
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
