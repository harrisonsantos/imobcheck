import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { vistaWebhookSchema } from '@/lib/vista/types';

async function processarNovoImovel(supabase: any, data: any) {
  const imovel = data.data;
  if (!imovel?.Codigo) return;

  // Buscar ou criar corretor se houver
  let corretorId = null;
  if (imovel.CodigoCorretor || imovel.Corretor?.Creci) {
    const creci = imovel.Corretor?.Creci;
    const email = imovel.Corretor?.['E-mail'];
    const nome = imovel.Corretor?.Nome;

    if (creci) {
      const { data: corretor } = await supabase
        .from('corretores')
        .select('id')
        .eq('creci', creci)
        .single();

      if (corretor) {
        corretorId = corretor.id;
      } else if (email && nome) {
        const { data: novoCorretor } = await supabase
          .from('corretores')
          .insert({
            nome,
            email,
            creci,
            vista_user_id: imovel.CodigoCorretor?.toString(),
          })
          .select('id')
          .single();
        corretorId = novoCorretor?.id || null;
      }
    }
  }

  // Montar endereço
  const endereco = [
    imovel.Endereco,
    imovel.Numero,
    imovel.Complemento,
    imovel.Bairro,
    imovel.Cidade,
  ]
    .filter(Boolean)
    .join(', ');

  // Upsert imóvel
  await supabase
    .from('imoveis')
    .upsert(
      {
        vista_id: imovel.Codigo.toString(),
        corretor_id: corretorId,
        endereco: endereco || imovel.Endereco || null,
        tipo: imovel.Categoria || null,
        valor: imovel.ValorVenda || imovel.ValorLocacao || null,
        matricula: imovel.Matricula || null,
        status: imovel.Status?.toLowerCase() || 'ativo',
      },
      {
        onConflict: 'vista_id',
      }
    );
}

async function processarNovoLead(supabase: any, data: any) {
  const lead = data.data;
  if (!lead?.Codigo) return;

  // Buscar corretor
  let corretorId = null;
  if (lead.CodigoCorretor) {
    const { data: corretor } = await supabase
      .from('corretores')
      .select('id')
      .eq('vista_user_id', lead.CodigoCorretor.toString())
      .single();
    corretorId = corretor?.id || null;
  }

  // Buscar imóvel se houver
  let imovelId = null;
  if (lead.CodigoImovel) {
    const { data: imovel } = await supabase
      .from('imoveis')
      .select('id')
      .eq('vista_id', lead.CodigoImovel.toString())
      .single();
    imovelId = imovel?.id || null;
  }

  // Upsert lead
  await supabase
    .from('leads')
    .upsert(
      {
        vista_id: lead.Codigo.toString(),
        corretor_id: corretorId,
        imovel_id: imovelId,
        nome: lead.Nome || null,
        email: lead.Email || null,
        telefone: lead.Telefone || lead.Celular || null,
        origem: lead.Origem?.toLowerCase() || null,
        status: lead.Status?.toLowerCase() || 'novo',
        valor_proposta: lead.ValorProposta || null,
      },
      {
        onConflict: 'vista_id',
      }
    );
}

async function processarNegocio(supabase: any, data: any) {
  const negocio = data.data;
  if (!negocio?.Codigo) return;

  // Buscar corretor
  let corretorId = null;
  if (negocio.CodigoCorretor) {
    const { data: corretor } = await supabase
      .from('corretores')
      .select('id')
      .eq('vista_user_id', negocio.CodigoCorretor.toString())
      .single();
    corretorId = corretor?.id || null;
  }

  // Buscar imóvel
  let imovelId = null;
  if (negocio.CodigoImovel) {
    const { data: imovel } = await supabase
      .from('imoveis')
      .select('id')
      .eq('vista_id', negocio.CodigoImovel.toString())
      .single();
    imovelId = imovel?.id || null;
  }

  // Buscar lead se houver
  let leadId = null;
  if (negocio.CodigoCliente) {
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('vista_id', negocio.CodigoCliente.toString())
      .single();
    leadId = lead?.id || null;
  }

  // Upsert negócio
  await supabase
    .from('negocios')
    .upsert(
      {
        vista_id: negocio.Codigo.toString(),
        corretor_id: corretorId,
        imovel_id: imovelId,
        lead_id: leadId,
        valor_venda: negocio.ValorVenda || null,
        comissao_percentual: negocio.ComissaoPercentual || null,
        comissao_valor: negocio.ComissaoValor || null,
        data_fechamento: negocio.DataFechamento || null,
        data_escritura: negocio.DataEscritura || null,
        status: negocio.Status?.toLowerCase() || 'pendente',
        observacoes: negocio.Observacoes || null,
      },
      {
        onConflict: 'vista_id',
      }
    );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { getEnv } = await import('@/lib/env');
    const env = getEnv();

    // Validar assinatura do webhook (se Vista fornecer)
    if (env.VISTA_WEBHOOK_SECRET) {
      const signature = req.headers.get('x-vista-signature');
      if (signature !== env.VISTA_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const body = await req.json();
    const data = vistaWebhookSchema.parse(body);

    // Processar evento
    switch (data.event_type) {
      case 'imovel.criado':
      case 'imovel.atualizado':
        await processarNovoImovel(supabase, data);
        break;
      case 'lead.criado':
      case 'lead.atualizado':
      case 'cliente.criado':
      case 'cliente.atualizado':
        await processarNovoLead(supabase, data);
        break;
      case 'negocio.atualizado':
      case 'negocio.criado':
        await processarNegocio(supabase, data);
        break;
      default:
        console.log(`Event type not processed: ${data.event_type}`);
    }

    // Registrar evento
    await supabase.from('eventos').insert({
      tipo: data.event_type,
      fonte: 'vista_webhook',
      dados: body,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: error.message },
      { status: 500 }
    );
  }
}
