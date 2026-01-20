import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { detectarAnomalias } from '@/lib/detectors/anomaly-detector';
import { enviarRelatorioEmail } from '@/lib/email/resend-client';

async function gerarRelatorio(supabase: any, anomalias: any[]) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeISO = hoje.toISOString();

  // Métricas do dia
  const { count: totalLeadsHoje } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', hojeISO);

  const { count: totalNegociosHoje } = await supabase
    .from('negocios')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', hojeISO);
  const taxaConversaoGeral = totalLeadsHoje > 0 
    ? ((totalNegociosHoje / totalLeadsHoje) * 100).toFixed(2)
    : '0.00';

  return {
    anomalias,
    metricas: {
      total_leads_hoje: totalLeadsHoje,
      total_negocios_hoje: totalNegociosHoje,
      taxa_conversao_geral: parseFloat(taxaConversaoGeral),
    },
  };
}

// Proteger com Vercel Cron Secret
export async function GET(req: NextRequest) {
  try {
    const { getEnv } = await import('@/lib/env');
    const env = getEnv();
    
    // Verificar se é chamada do Vercel Cron ou se tem o secret
    const authHeader = req.headers.get('authorization');
    const cronSecret = req.headers.get('x-vercel-cron-secret');
    
    // Vercel Cron envia o secret no header Authorization ou x-vercel-cron-secret
    if (cronSecret !== env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Detectar anomalias
    const anomalias = await detectarAnomalias(supabase);

    // Salvar no banco
    if (anomalias.length > 0) {
      await supabase.from('anomalias').insert(anomalias);
    }

    // Gerar relatório
    const relatorio = await gerarRelatorio(supabase, anomalias);

    // Enviar email
    await enviarRelatorioEmail(relatorio);

    return NextResponse.json({
      anomalias_encontradas: anomalias.length,
      relatorio_enviado: true,
      metricas: relatorio.metricas,
    });
  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: error.message },
      { status: 500 }
    );
  }
}
