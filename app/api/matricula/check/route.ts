import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { z } from 'zod';

const matriculaCheckSchema = z.object({
  imovel_id: z.string().uuid(),
  numero_matricula: z.string().optional(),
  cartorio: z.string().optional(),
  cidade: z.string().optional(),
});

// Nota: Não existe API pública gratuita para consulta de matrículas no Brasil
// Este endpoint valida manualmente os dados fornecidos

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imovel_id, numero_matricula, cartorio, cidade } = matriculaCheckSchema.parse(body);

    const supabase = createServiceRoleClient();

    // Buscar imóvel
    const { data: imovel, error } = await supabase
      .from('imoveis')
      .select('*')
      .eq('id', imovel_id)
      .single();

    if (error || !imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    // Atualizar informações da matrícula
    const updateData: any = {
      matricula_verificada: true,
      matricula_verificada_em: new Date().toISOString(),
    };

    if (numero_matricula) updateData.matricula = numero_matricula;

    await supabase
      .from('imoveis')
      .update(updateData)
      .eq('id', imovel_id);

    // Registrar evento de verificação
    await supabase.from('eventos').insert({
      tipo: 'matricula_verificada',
      fonte: 'manual',
      dados: {
        imovel_id,
        numero_matricula,
        cartorio,
        cidade,
        verificado_em: new Date().toISOString(),
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Matrícula verificada com sucesso',
      data: {
        imovel_id,
        numero_matricula,
        cartorio,
        cidade,
      }
    });
  } catch (error: any) {
    console.error('Matrícula check error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: error.message },
      { status: 500 }
    );
  }
}

// GET para consultar status de verificação
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imovel_id = searchParams.get('imovel_id');

    if (!imovel_id) {
      return NextResponse.json({ error: 'imovel_id required' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { data: imovel, error } = await supabase
      .from('imoveis')
      .select('id, matricula, matricula_verificada, matricula_verificada_em, endereco')
      .eq('id', imovel_id)
      .single();

    if (error || !imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: imovel,
    });
  } catch (error: any) {
    console.error('Matrícula check GET error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: error.message },
      { status: 500 }
    );
  }
}
