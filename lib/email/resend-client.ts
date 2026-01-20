import { Resend } from 'resend';
import { getEnv } from '@/lib/env';
import DailyReport from './templates/daily-report';
import AnomalyAlert from './templates/anomaly-alert';

// Lazy instantiation to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const env = getEnv();
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
}

interface Relatorio {
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

export async function enviarRelatorioEmail(relatorio: Relatorio) {
  try {
    const env = getEnv();
    const resend = getResendClient();
    
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.EMAIL_TO,
      subject: `Relatório Diário - ${relatorio.anomalias.length} Anomalias Detectadas`,
      react: DailyReport({
        anomalias: relatorio.anomalias,
        metricas: relatorio.metricas,
      }),
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent:', data);
    return data;
  } catch (error) {
    console.error('Error in enviarRelatorioEmail:', error);
    throw error;
  }
}

export async function enviarAlertaAnomalia(anomalia: Relatorio['anomalias'][0]) {
  try {
    const env = getEnv();
    const resend = getResendClient();
    
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.EMAIL_TO,
      subject: `🚨 Alerta: ${anomalia.tipo} - ${anomalia.severidade.toUpperCase()}`,
      react: AnomalyAlert({
        anomalia,
      }),
    });

    if (error) {
      console.error('Error sending alert email:', error);
      throw error;
    }

    console.log('Alert email sent:', data);
    return data;
  } catch (error) {
    console.error('Error in enviarAlertaAnomalia:', error);
    throw error;
  }
}
