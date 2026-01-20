import type { SupabaseClient } from '@supabase/supabase-js';
import { calcularTaxasConversao } from './patterns';

export interface Anomalia {
  tipo: string;
  severidade: 'baixa' | 'media' | 'alta';
  corretor_id: string | null;
  entidade_tipo?: string;
  entidade_id?: string;
  descricao: string;
  dados_contexto: Record<string, any>;
}

export async function detectarAnomalias(supabase: any): Promise<Anomalia[]> {
  const anomalias: Anomalia[] = [];

  // 1. Leads que viraram "perdido" muito rápido (< 24h)
  const vinteQuatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: leadsRapidos } = await supabase
    .from('leads')
    .select('*, corretores(*)')
    .eq('status', 'perdido')
    .gte('created_at', vinteQuatroHorasAtras);

  if (leadsRapidos) {
    for (const lead of leadsRapidos) {
      const tempoEmHoras = Math.abs(
        new Date(lead.created_at).getTime() - new Date(lead.updated_at).getTime()
      ) / (1000 * 60 * 60);

      if (tempoEmHoras < 24) {
        anomalias.push({
          tipo: 'lead_perdido_rapido',
          severidade: 'media',
          corretor_id: lead.corretor_id,
          entidade_tipo: 'lead',
          entidade_id: lead.id,
          descricao: `Lead ${lead.nome || 'sem nome'} marcado como perdido em menos de 24h (${tempoEmHoras.toFixed(1)}h)`,
          dados_contexto: {
            lead_id: lead.id,
            tempo_horas: tempoEmHoras,
            created_at: lead.created_at,
            updated_at: lead.updated_at,
          },
        });
      }
    }
  }

  // 2. Corretor com taxa de conversão muito baixa
  const taxasConversao = await calcularTaxasConversao(supabase);
  if (taxasConversao.length > 0) {
    const mediaGlobal =
      taxasConversao.reduce((acc, t) => acc + t.taxa, 0) / taxasConversao.length;

    for (const taxa of taxasConversao) {
      if (taxa.taxa < mediaGlobal * 0.3 && taxa.total_leads > 10) {
        anomalias.push({
          tipo: 'taxa_conversao_baixa',
          severidade: 'alta',
          corretor_id: taxa.corretor_id,
          descricao: `Taxa de conversão de ${taxa.taxa}% muito abaixo da média global (${mediaGlobal.toFixed(2)}%). ${taxa.total_leads} leads e ${taxa.total_negocios} negócios fechados.`,
          dados_contexto: {
            taxa: taxa.taxa,
            media_global: mediaGlobal,
            total_leads: taxa.total_leads,
            total_negocios: taxa.total_negocios,
          },
        });
      }
    }
  }

  // 3. Imóvel vendido sem negócio registrado
  const { data: imoveisVendidos } = await supabase
    .from('imoveis')
    .select('id, endereco, corretor_id, vista_id')
    .eq('status', 'vendido');

  if (imoveisVendidos) {
    for (const imovel of imoveisVendidos) {
      const { data: negocios } = await supabase
        .from('negocios')
        .select('id')
        .eq('imovel_id', imovel.id)
        .limit(1);

      if (!negocios || negocios.length === 0) {
        anomalias.push({
          tipo: 'venda_nao_registrada',
          severidade: 'alta',
          corretor_id: imovel.corretor_id,
          entidade_tipo: 'imovel',
          entidade_id: imovel.id,
          descricao: `Imóvel ${imovel.endereco || imovel.vista_id} marcado como vendido sem negócio registrado`,
          dados_contexto: {
            imovel_id: imovel.id,
            vista_id: imovel.vista_id,
          },
        });
      }
    }
  }

  // 4. Lead que "desapareceu" (sem atualizações há 30+ dias)
  const trintaDiasAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: leadsInativos } = await supabase
    .from('leads')
    .select('*')
    .in('status', ['novo', 'contatado'])
    .lt('updated_at', trintaDiasAtras);

  if (leadsInativos) {
    for (const lead of leadsInativos) {
      const diasInativo = Math.floor(
        (Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      anomalias.push({
        tipo: 'lead_inativo',
        severidade: 'baixa',
        corretor_id: lead.corretor_id,
        entidade_tipo: 'lead',
        entidade_id: lead.id,
        descricao: `Lead ${lead.nome || 'sem nome'} sem atualizações há ${diasInativo} dias`,
        dados_contexto: {
          lead_id: lead.id,
          dias_inativo: diasInativo,
          status: lead.status,
          updated_at: lead.updated_at,
        },
      });
    }
  }

  // 5. Negócio com data de fechamento futura
  const hoje = new Date().toISOString().split('T')[0];
  const { data: negociosFuturos } = await supabase
    .from('negocios')
    .select('id, data_fechamento, corretor_id, valor_venda')
    .not('data_fechamento', 'is', null)
    .gt('data_fechamento', hoje);

  if (negociosFuturos) {
    for (const negocio of negociosFuturos) {
      anomalias.push({
        tipo: 'negocio_data_futura',
        severidade: 'media',
        corretor_id: negocio.corretor_id,
        entidade_tipo: 'negocio',
        entidade_id: negocio.id,
        descricao: `Negócio com data de fechamento futura: ${negocio.data_fechamento}`,
        dados_contexto: {
          negocio_id: negocio.id,
          data_fechamento: negocio.data_fechamento,
          valor_venda: negocio.valor_venda,
        },
      });
    }
  }

  return anomalias;
}
