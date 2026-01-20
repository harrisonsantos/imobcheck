import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vistaWebhookSchema } from '@/lib/vista/types';

describe('Vista Webhook API', () => {
  it('deve validar schema de webhook corretamente', () => {
    const validPayload = {
      event_type: 'imovel.criado',
      data: {
        Codigo: '12345',
        Endereco: 'Rua Teste, 123',
        Categoria: 'Apartamento',
        ValorVenda: 500000,
      },
    };

    const result = vistaWebhookSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar payload inválido', () => {
    const invalidPayload = {
      event_type: 'evento_invalido',
      data: {},
    };

    const result = vistaWebhookSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it('deve aceitar todos os tipos de eventos válidos', () => {
    const eventTypes = [
      'imovel.criado',
      'imovel.atualizado',
      'lead.criado',
      'lead.atualizado',
      'cliente.criado',
      'cliente.atualizado',
      'negocio.criado',
      'negocio.atualizado',
    ];

    eventTypes.forEach((event_type) => {
      const payload = {
        event_type,
        data: { Codigo: '123' },
      };
      const result = vistaWebhookSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });
});

describe('Webhook Processing', () => {
  it('deve extrair endereço completo de imóvel', () => {
    const imovel = {
      Endereco: 'Rua Teste',
      Numero: '123',
      Complemento: 'Apto 45',
      Bairro: 'Centro',
      Cidade: 'São Paulo',
    };

    const endereco = [
      imovel.Endereco,
      imovel.Numero,
      imovel.Complemento,
      imovel.Bairro,
      imovel.Cidade,
    ]
      .filter(Boolean)
      .join(', ');

    expect(endereco).toBe('Rua Teste, 123, Apto 45, Centro, São Paulo');
  });

  it('deve lidar com endereço parcial', () => {
    const imovel = {
      Endereco: 'Rua Teste',
      Cidade: 'São Paulo',
    };

    const endereco = [
      imovel.Endereco,
      imovel.Numero,
      imovel.Complemento,
      imovel.Bairro,
      imovel.Cidade,
    ]
      .filter(Boolean)
      .join(', ');

    expect(endereco).toBe('Rua Teste, São Paulo');
  });
});
