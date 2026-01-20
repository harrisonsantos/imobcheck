'use client';

interface ExportButtonsProps {
  data: any[];
  filename: string;
  type: 'leads' | 'negocios' | 'anomalias' | 'corretores';
}

export function ExportButtons({ data, filename, type }: ExportButtonsProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('Nenhum dado disponível para exportar');
      return;
    }

    let headers: string[] = [];
    let rows: string[][] = [];

    // Definir headers e rows baseado no tipo
    switch (type) {
      case 'leads':
        headers = ['ID', 'Nome', 'Email', 'Telefone', 'Status', 'Corretor', 'Data Criação'];
        rows = data.map(item => [
          item.id || '',
          item.nome || '',
          item.email || '',
          item.telefone || '',
          item.status || '',
          item.corretores?.nome || '',
          new Date(item.created_at).toLocaleDateString('pt-BR'),
        ]);
        break;

      case 'negocios':
        headers = ['ID', 'Valor Venda', 'Status', 'Corretor', 'Imóvel', 'Data Fechamento', 'Comissão'];
        rows = data.map(item => [
          item.id || '',
          item.valor_venda ? `R$ ${Number(item.valor_venda).toLocaleString('pt-BR')}` : '',
          item.status || '',
          item.corretores?.nome || '',
          item.imoveis?.endereco || '',
          item.data_fechamento ? new Date(item.data_fechamento).toLocaleDateString('pt-BR') : '',
          item.comissao_valor ? `R$ ${Number(item.comissao_valor).toLocaleString('pt-BR')}` : '',
        ]);
        break;

      case 'anomalias':
        headers = ['ID', 'Tipo', 'Severidade', 'Descrição', 'Corretor', 'Data Detecção', 'Resolvida'];
        rows = data.map(item => [
          item.id || '',
          item.tipo || '',
          item.severidade || '',
          item.descricao || '',
          item.corretores?.nome || '',
          new Date(item.created_at).toLocaleDateString('pt-BR'),
          item.resolvida ? 'Sim' : 'Não',
        ]);
        break;

      case 'corretores':
        headers = ['ID', 'Nome', 'Email', 'CRECI', 'Telefone', 'Ativo', 'Data Cadastro'];
        rows = data.map(item => [
          item.id || '',
          item.nome || '',
          item.email || '',
          item.creci || '',
          item.telefone || '',
          item.ativo ? 'Sim' : 'Não',
          new Date(item.created_at).toLocaleDateString('pt-BR'),
        ]);
        break;
    }

    // Criar CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    alert('Exportação para PDF será implementada em breve. Por enquanto, use a exportação para CSV.');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToCSV}
        className="px-4 py-2 bg-[#10B981] text-white rounded-md hover:bg-[#059669] transition-colors text-sm font-semibold flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exportar CSV
      </button>

      <button
        onClick={printReport}
        className="px-4 py-2 bg-[#1B489B] text-white rounded-md hover:bg-[#0C0F24] transition-colors text-sm font-semibold flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Imprimir
      </button>
    </div>
  );
}
