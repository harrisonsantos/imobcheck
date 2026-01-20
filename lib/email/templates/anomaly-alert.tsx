import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface AnomalyAlertProps {
  anomalia: {
    tipo: string;
    severidade: 'baixa' | 'media' | 'alta';
    descricao: string;
    dados_contexto: Record<string, any>;
  };
}

export default function AnomalyAlert({ anomalia }: AnomalyAlertProps) {
  const severidadeColor = 
    anomalia.severidade === 'alta' ? '#d32f2f' :
    anomalia.severidade === 'media' ? '#f57c00' : '#fbc02d';
  
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#ffffff' }}>
          <Section>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: severidadeColor, marginBottom: '20px' }}>
              🚨 Alerta de Anomalia
            </Text>
            
            <div
              style={{
                padding: '15px',
                marginBottom: '20px',
                border: `2px solid ${severidadeColor}`,
                borderRadius: '6px',
                backgroundColor: '#fffbf5',
              }}
            >
              <Text style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: severidadeColor, textTransform: 'uppercase' }}>
                {anomalia.severidade}
              </Text>
              <Text style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333' }}>
                Tipo: {anomalia.tipo}
              </Text>
              <Text style={{ margin: '0', color: '#555' }}>
                {anomalia.descricao}
              </Text>
            </div>
            
            {Object.keys(anomalia.dados_contexto).length > 0 && (
              <Section style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <Text style={{ fontWeight: 'bold', marginBottom: '10px' }}>Detalhes:</Text>
                <pre style={{ fontSize: '12px', color: '#666', margin: '0', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(anomalia.dados_contexto, null, 2)}
                </pre>
              </Section>
            )}
            
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
                Ver no Dashboard
              </Button>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
