import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { z } from 'zod';

const matriculaCheckSchema = z.object({
  imovel_id: z.string().uuid(),
});

// Nota: Não existe API pública para consulta de matrículas no Brasil
// Opções:
// 1. Integração manual - corretor faz upload do PDF da matrícula
// 2. OCR do PDF para extrair dados e validar
// 3. Serviços pagos (ex: Consultas ao Registro de Imóveis via parceiros)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imovel_id } = matriculaCheckSchema.parse(body);

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

    if (!imovel.matricula) {
      return NextResponse.json(
        { error: 'Imóvel sem matrícula cadastrada' },
        { status: 400 }
      );
    }

    // Aqui você implementaria:
    // - Upload de PDF da matrícula
    // - OCR para extrair dados
    // - Validação básica (número, cartório, cidade)
    // - Armazenamento no Supabase Storage

    // Por enquanto, apenas marca como verificado manualmente
    await supabase
      .from('imoveis')
      .update({
        matricula_verificada: true,
        matricula_verificada_em: new Date().toISOString(),
      })
      .eq('id', imovel_id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Matrícula check error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: error.message },
      { status: 500 }
    );
  }
}
