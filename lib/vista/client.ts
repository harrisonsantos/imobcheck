import { getEnv } from '@/lib/env';
import type { VistaPesquisa, VistaResponse } from './types';

export interface VistaClientOptions {
  apiKey?: string;
  apiUrl?: string;
}

export class VistaClient {
  private apiKey: string;
  private apiUrl: string;

  constructor(options?: VistaClientOptions) {
    const env = getEnv();
    this.apiKey = options?.apiKey || env.VISTA_API_KEY || '';
    this.apiUrl = options?.apiUrl || env.VISTA_API_URL || 'http://sandbox-rest.vistahost.com.br';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    pesquisa?: VistaPesquisa
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('VISTA_API_KEY is required. Set it via constructor options or setApiKey() method.');
    }
    
    const url = new URL(`${this.apiUrl}/${endpoint}`);
    url.searchParams.set('key', this.apiKey);
    
    if (pesquisa) {
      url.searchParams.set('pesquisa', JSON.stringify(pesquisa));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vista API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async listarImoveis(pesquisa?: VistaPesquisa): Promise<VistaResponse> {
    return this.request<VistaResponse>('imoveis/listar', pesquisa);
  }

  async detalhesImovel(codigo: string, pesquisa?: VistaPesquisa): Promise<any> {
    if (!this.apiKey) {
      throw new Error('VISTA_API_KEY is required. Set it via constructor options or setApiKey() method.');
    }
    
    const url = new URL(`${this.apiUrl}/imoveis/detalhes`);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('imovel', codigo);
    
    if (pesquisa) {
      url.searchParams.set('pesquisa', JSON.stringify(pesquisa));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vista API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async listarClientes(pesquisa?: VistaPesquisa): Promise<VistaResponse> {
    return this.request<VistaResponse>('clientes/listar', pesquisa);
  }

  async detalhesCliente(codigo: string, pesquisa?: VistaPesquisa): Promise<any> {
    if (!this.apiKey) {
      throw new Error('VISTA_API_KEY is required. Set it via constructor options or setApiKey() method.');
    }
    
    const url = new URL(`${this.apiUrl}/clientes/detalhes`);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('cliente', codigo);
    
    if (pesquisa) {
      url.searchParams.set('pesquisa', JSON.stringify(pesquisa));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vista API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async listarConteudo(tipos: string[]): Promise<any> {
    const pesquisa = {
      listarConteudo: tipos,
    } as any; // Vista API específico - não segue schema padrão
    return this.request<any>('imoveis/listar', pesquisa);
  }
}
