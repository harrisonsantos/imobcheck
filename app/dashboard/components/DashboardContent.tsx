import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import DashboardContentEnhanced from './DashboardContentEnhanced';

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
      .limit(100),
    supabaseService
      .from('corretores')
      .select('*')
      .eq('ativo', true)
      .order('nome'),
    supabaseService
      .from('leads')
      .select('*, corretores(nome), imoveis(endereco)')
      .order('created_at', { ascending: false })
      .limit(100),
    supabaseService
      .from('negocios')
      .select('*, corretores(nome), imoveis(endereco), leads(nome)')
      .order('created_at', { ascending: false })
      .limit(100),
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

  const initialData = {
    anomalias: anomalias.data || [],
    corretores: corretores.data || [],
    leads: leads.data || [],
    negocios: negocios.data || [],
    metricas: {
      leadsHoje: totalLeadsHoje || 0,
      negociosHoje: totalNegociosHoje || 0,
      anomaliasPendentes: totalAnomalias || 0,
    },
  };

  return <DashboardContentEnhanced initialData={initialData} />;
}
