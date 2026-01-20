export interface TaxaConversao {
  corretor_id: string;
  taxa: number;
  total_leads: number;
  total_negocios: number;
}

export async function calcularTaxasConversao(supabase: any): Promise<TaxaConversao[]> {
  // Buscar todos os corretores ativos
  const { data: corretores } = await supabase
    .from('corretores')
    .select('id')
    .eq('ativo', true);

  if (!corretores || corretores.length === 0) {
    return [];
  }

  const taxas: TaxaConversao[] = [];

  for (const corretor of corretores) {
    // Total de leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('corretor_id', corretor.id);

    // Total de negócios fechados
    const { count: totalNegocios } = await supabase
      .from('negocios')
      .select('id', { count: 'exact', head: true })
      .eq('corretor_id', corretor.id)
      .eq('status', 'concluído');

    const leads = totalLeads || 0;
    const negocios = totalNegocios || 0;
    const taxa = leads > 0 ? (negocios / leads) * 100 : 0;

    taxas.push({
      corretor_id: corretor.id,
      taxa: parseFloat(taxa.toFixed(2)),
      total_leads: leads,
      total_negocios: negocios,
    });
  }

  return taxas;
}
