interface Corretor {
  id: string;
  nome: string;
  email: string;
  creci: string;
  ativo: boolean;
}

interface CorretoresListProps {
  corretores: Corretor[];
}

export default function CorretoresList({ corretores }: CorretoresListProps) {
  if (corretores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Nenhum corretor encontrado
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {corretores.map((corretor) => (
          <div key={corretor.id} className="p-4">
            <div className="font-medium text-gray-900">{corretor.nome}</div>
            <div className="text-sm text-gray-500">{corretor.email}</div>
            <div className="text-xs text-gray-400">CRECI: {corretor.creci}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
