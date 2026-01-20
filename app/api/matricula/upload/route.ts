import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const imovel_id = formData.get('imovel_id') as string;

    if (!file || !imovel_id) {
      return NextResponse.json(
        { error: 'File and imovel_id are required' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Apenas arquivos PDF, JPEG e PNG são permitidos' },
        { status: 400 }
      );
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo: 10MB' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Verificar se imóvel existe
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select('id, endereco')
      .eq('id', imovel_id)
      .single();

    if (imovelError || !imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    // Converter File para ArrayBuffer e depois para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload para Supabase Storage
    const fileName = `${imovel_id}_${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('matriculas')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo', details: uploadError.message },
        { status: 500 }
      );
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('matriculas')
      .getPublicUrl(fileName);

    // Atualizar registro do imóvel
    await supabase
      .from('imoveis')
      .update({
        matricula_documento_url: urlData.publicUrl,
      })
      .eq('id', imovel_id);

    // Registrar evento
    await supabase.from('eventos').insert({
      tipo: 'matricula_upload',
      fonte: 'manual',
      dados: {
        imovel_id,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        url: urlData.publicUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      data: {
        file_name: fileName,
        url: urlData.publicUrl,
        imovel_id,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal error', details: error.message },
      { status: 500 }
    );
  }
}
