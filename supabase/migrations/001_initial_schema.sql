-- Corretores
CREATE TABLE IF NOT EXISTS corretores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  creci TEXT UNIQUE NOT NULL,
  vista_user_id TEXT UNIQUE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Imóveis
CREATE TABLE IF NOT EXISTS imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vista_id TEXT UNIQUE NOT NULL,
  corretor_id UUID REFERENCES corretores(id),
  endereco TEXT,
  tipo TEXT, -- casa, apartamento, etc
  valor DECIMAL(12,2),
  matricula TEXT,
  matricula_verificada BOOLEAN DEFAULT false,
  matricula_verificada_em TIMESTAMPTZ,
  status TEXT, -- ativo, vendido, locado, etc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vista_id TEXT UNIQUE NOT NULL,
  corretor_id UUID REFERENCES corretores(id),
  imovel_id UUID REFERENCES imoveis(id),
  nome TEXT,
  email TEXT,
  telefone TEXT,
  origem TEXT, -- site, indicação, marketing, etc
  status TEXT, -- novo, contatado, proposta, ganho, perdido
  valor_proposta DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendas/Negócios
CREATE TABLE IF NOT EXISTS negocios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vista_id TEXT UNIQUE,
  corretor_id UUID REFERENCES corretores(id),
  imovel_id UUID REFERENCES imoveis(id),
  lead_id UUID REFERENCES leads(id),
  valor_venda DECIMAL(12,2),
  comissao_percentual DECIMAL(5,2),
  comissao_valor DECIMAL(12,2),
  data_fechamento DATE,
  data_escritura DATE,
  status TEXT, -- pendente, concluído, cancelado
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anomalias detectadas
CREATE TABLE IF NOT EXISTS anomalias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL, -- lead_desaparecido, venda_nao_registrada, etc
  severidade TEXT NOT NULL, -- baixa, media, alta
  corretor_id UUID REFERENCES corretores(id),
  entidade_tipo TEXT, -- lead, imovel, negocio
  entidade_id UUID,
  descricao TEXT,
  dados_contexto JSONB,
  resolvida BOOLEAN DEFAULT false,
  resolvida_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logs de eventos (auditoria)
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  fonte TEXT, -- vista_webhook, manual, sistema
  corretor_id UUID REFERENCES corretores(id),
  dados JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_imoveis_corretor ON imoveis(corretor_id);
CREATE INDEX IF NOT EXISTS idx_leads_corretor ON leads(corretor_id);
CREATE INDEX IF NOT EXISTS idx_negocios_corretor ON negocios(corretor_id);
CREATE INDEX IF NOT EXISTS idx_anomalias_resolvida ON anomalias(resolvida);
CREATE INDEX IF NOT EXISTS idx_anomalias_corretor ON anomalias(corretor_id);
CREATE INDEX IF NOT EXISTS idx_eventos_created ON eventos(created_at);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON eventos(tipo);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_corretores_updated_at BEFORE UPDATE ON corretores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_imoveis_updated_at BEFORE UPDATE ON imoveis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_negocios_updated_at BEFORE UPDATE ON negocios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
