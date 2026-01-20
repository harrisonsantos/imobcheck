import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface DailyReportProps {
  anomalias: Array<{
    tipo: string;
    severidade: 'baixa' | 'media' | 'alta';
    descricao: string;
    dados_contexto: Record<string, any>;
  }>;
  metricas: {
    total_leads_hoje: number;
    total_negocios_hoje: number;
    taxa_conversao_geral: number;
  };
}

export default function DailyReport({ anomalias, metricas }: DailyReportProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#ffffff' }}>
          <Section>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
              Relatório Diário de Vendas
            </Text>
            
            <Text style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
              📊 Métricas do Dia:
            </Text>
            
            <ul style={{ paddingLeft: '20px', color: '#333' }}>
              <li style={{ marginBottom: '8px' }}>Leads: <strong>{metricas.total_leads_hoje}</strong></li>
              <li style={{ marginBottom: '8px' }}>Negócios: <strong>{metricas.total_negocios_hoje}</strong></li>
              <li style={{ marginBottom: '8px' }}>Taxa de Conversão: <strong>{metricas.taxa_conversao_geral.toFixed(2)}%</strong></li>
            </ul>
            
            <Hr style={{ margin: '20px 0', borderColor: '#ddd' }} />
            
            {anomalias.length > 0 ? (
              <>
                <Text style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>
                  ⚠️ {anomalias.length} Anomalias Detectadas
                </Text>
                {anomalias.map((a, i) => {
                  const severidadeColor = 
                    a.severidade === 'alta' ? '#d32f2f' :
                    a.severidade === 'media' ? '#f57c00' : '#fbc02d';
                  
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '12px',
                        marginBottom: '12px',
                        border: `1px solid ${severidadeColor}`,
                        borderRadius: '4px',
                        backgroundColor: '#fffbf5',
                      }}
                    >
                      <Text style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: severidadeColor }}>
                        {a.tipo} - {a.severidade.toUpperCase()}
                      </Text>
                      <Text style={{ margin: '0', color: '#333' }}>
                        {a.descricao}
                      </Text>
                    </div>
                  );
                })}
                
                <Section style={{ marginTop: '30px', textAlign: 'center' }}>
                  <Button
                    href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
                    style={{
                      background: '#1976d2',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      fontWeight: 'bold',
                    }}
                  >
                    Ver Dashboard
                  </Button>
                </Section>
              </>
            ) : (
              <Text style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '16px' }}>
                ✅ Nenhuma anomalia detectada hoje!
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
