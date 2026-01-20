import { describe, it, expect, vi, beforeEach } from 'vitest';
import { detectarAnomalias } from '@/lib/detectors/anomaly-detector';

// Mock do Supabase
const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  gte: vi.fn(() => mockSupabase),
  lt: vi.fn(() => mockSupabase),
  gt: vi.fn(() => mockSupabase),
  in: vi.fn(() => mockSupabase),
  not: vi.fn(() => mockSupabase),
  limit: vi.fn(() => mockSupabase),
  single: vi.fn(() => ({ data: null, error: null })),
};

describe('Detector de Anomalias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve detectar leads perdidos rapidamente (< 24h)', async () => {
    const agora = new Date();
    const horasAtras = new Date(agora.getTime() - 12 * 60 * 60 * 1000); // 12 horas atrás

    mockSupabase.from = vi.fn(() => mockSupabase);
    mockSupabase.select = vi.fn(() => mockSupabase);
    mockSupabase.eq = vi.fn(() => mockSupabase);
    mockSupabase.gte = vi.fn(() => ({
      data: [
        {
          id: '1',
          nome: 'João Silva',
          status: 'perdido',
          corretor_id: 'corretor-1',
          created_at: horasAtras.toISOString(),
          updated_at: agora.toISOString(),
          corretores: { nome: 'Maria Corretor' },
        },
      ],
      error: null,
    }));

    const anomalias = await detectarAnomalias(mockSupabase as any);

    expect(anomalias).toBeDefined();
    expect(anomalias.length).toBeGreaterThan(0);
    const leadRapido = anomalias.find((a) => a.tipo === 'lead_perdido_rapido');
    expect(leadRapido).toBeDefined();
    expect(leadRapido?.severidade).toBe('media');
  });

  it('deve detectar vendas não registradas', async () => {
    let callCount = 0;
    
    mockSupabase.from = vi.fn((table) => {
      if (table === 'imoveis') {
        mockSupabase.select = vi.fn(() => mockSupabase);
        mockSupabase.eq = vi.fn(() => ({
          data: [
            {
              id: 'imovel-1',
              endereco: 'Rua Teste, 123',
              corretor_id: 'corretor-1',
              vista_id: 'V123',
              status: 'vendido',
            },
          ],
          error: null,
        }));
      } else if (table === 'negocios') {
        mockSupabase.select = vi.fn(() => mockSupabase);
        mockSupabase.eq = vi.fn(() => mockSupabase);
        mockSupabase.limit = vi.fn(() => ({
          data: [], // Nenhum negócio encontrado
          error: null,
        }));
      }
      return mockSupabase;
    });

    const anomalias = await detectarAnomalias(mockSupabase as any);

    const vendaNaoRegistrada = anomalias.find((a) => a.tipo === 'venda_nao_registrada');
    expect(vendaNaoRegistrada).toBeDefined();
    expect(vendaNaoRegistrada?.severidade).toBe('alta');
  });

  it('deve detectar leads inativos (> 30 dias)', async () => {
    const trintaDiasAtras = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000);

    mockSupabase.from = vi.fn(() => mockSupabase);
    mockSupabase.select = vi.fn(() => mockSupabase);
    mockSupabase.in = vi.fn(() => mockSupabase);
    mockSupabase.lt = vi.fn(() => ({
      data: [
        {
          id: '1',
          nome: 'Lead Antigo',
          status: 'novo',
          corretor_id: 'corretor-1',
          updated_at: trintaDiasAtras.toISOString(),
        },
      ],
      error: null,
    }));

    const anomalias = await detectarAnomalias(mockSupabase as any);

    const leadInativo = anomalias.find((a) => a.tipo === 'lead_inativo');
    expect(leadInativo).toBeDefined();
    expect(leadInativo?.severidade).toBe('baixa');
  });

  it('deve detectar negócios com data futura', async () => {
    const dataFutura = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    mockSupabase.from = vi.fn(() => mockSupabase);
    mockSupabase.select = vi.fn(() => mockSupabase);
    mockSupabase.not = vi.fn(() => mockSupabase);
    mockSupabase.gt = vi.fn(() => ({
      data: [
        {
          id: '1',
          corretor_id: 'corretor-1',
          valor_venda: 500000,
          data_fechamento: dataFutura.toISOString().split('T')[0],
        },
      ],
      error: null,
    }));

    const anomalias = await detectarAnomalias(mockSupabase as any);

    const negocioFuturo = anomalias.find((a) => a.tipo === 'negocio_data_futura');
    expect(negocioFuturo).toBeDefined();
    expect(negocioFuturo?.severidade).toBe('media');
  });

  it('não deve retornar anomalias quando não há problemas', async () => {
    mockSupabase.from = vi.fn(() => mockSupabase);
    mockSupabase.select = vi.fn(() => mockSupabase);
    mockSupabase.eq = vi.fn(() => mockSupabase);
    mockSupabase.gte = vi.fn(() => ({ data: [], error: null }));
    mockSupabase.in = vi.fn(() => mockSupabase);
    mockSupabase.lt = vi.fn(() => ({ data: [], error: null }));
    mockSupabase.not = vi.fn(() => mockSupabase);
    mockSupabase.gt = vi.fn(() => ({ data: [], error: null }));

    const anomalias = await detectarAnomalias(mockSupabase as any);

    expect(anomalias).toBeDefined();
    expect(anomalias.length).toBe(0);
  });
});
