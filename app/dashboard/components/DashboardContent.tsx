import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import AnomaliasList from './AnomaliasList';
import MetricasCards from './MetricasCards';
import CorretoresList from './CorretoresList';
import LeadsList from './LeadsList';
import NegociosList from './NegociosList';
import LogoutButton from './LogoutButton';

export default async function DashboardContent() {
  const supabase = await createClient();
  const supabaseService = createServiceRoleClient();

  // Buscar dados
  const [anomalias, corretores, leads, negocios] = await Promise.all([
    supabaseService
      .from('anomalias')
      .select('*, corretores(nome, email)')
      .eq('resolvida', false)
      .order('created_at', { ascending: false })
      .limit(20),
    supabaseService
      .from('corretores')
      .select('*')
      .eq('ativo', true)
      .order('nome'),
    supabaseService
      .from('leads')
      .select('*, corretores(nome), imoveis(endereco)')
      .order('created_at', { ascending: false })
      .limit(50),
    supabaseService
      .from('negocios')
      .select('*, corretores(nome), imoveis(endereco), leads(nome)')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  // Métricas
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeISO = hoje.toISOString();

  const { count: totalLeadsHoje } = await supabaseService
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', hojeISO);

  const { count: totalNegociosHoje } = await supabaseService
    .from('negocios')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', hojeISO);

  const { count: totalAnomalias } = await supabaseService
    .from('anomalias')
    .select('id', { count: 'exact', head: true })
    .eq('resolvida', false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Auditoria</h1>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MetricasCards
          leadsHoje={totalLeadsHoje || 0}
          negociosHoje={totalNegociosHoje || 0}
          anomaliasPendentes={totalAnomalias || 0}
        />

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Anomalias Pendentes</h2>
          <AnomaliasList anomalias={anomalias.data || []} />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Corretores Ativos</h2>
            <CorretoresList corretores={corretores.data || []} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Leads Recentes</h2>
            <LeadsList leads={leads.data || []} />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Negócios Recentes</h2>
          <NegociosList negocios={negocios.data || []} />
        </div>
      </div>
    </div>
  );
}
