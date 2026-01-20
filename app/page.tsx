import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header/Navbar */}
      <header className="bg-[#0C0F24] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-white font-bold text-3xl tracking-tight">
                e<span className="text-[#1B489B]">X</span>p
              </div>
              <div className="border-l border-gray-600 pl-3">
                <span className="text-white text-xl font-semibold">ImobCheck</span>
              </div>
            </div>
            <Link
              href="/dashboard/login"
              className="bg-[#1B489B] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#153a7a] transition-colors"
            >
              Acessar Sistema
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0C0F24] to-[#1B489B] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Plataforma Inteligente de Auditoria Imobiliária
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Monitoramento automatizado, detecção de anomalias e conformidade em tempo real para operações imobiliárias
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-[#0C0F24] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Ver Dashboard
              </Link>
              <a
                href="#servicos"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#0C0F24] transition-colors"
              >
                Conheça os Serviços
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-[#0C0F24]">
              Serviços Desenvolvidos
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Soluções completas para auditoria e monitoramento de vendas imobiliárias
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Dashboard Service */}
              <div className="bg-gradient-to-br from-[#0C0F24] to-[#1B489B] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Dashboard Executivo</h3>
                <p className="text-gray-200 mb-6">
                  Visualização completa de leads, negócios, corretores e anomalias em tempo real com métricas detalhadas
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-white text-[#0C0F24] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Acessar →
                </Link>
              </div>

              {/* Webhook Service */}
              <div className="bg-gradient-to-br from-[#1B489B] to-[#0C0F24] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="text-5xl mb-4">🔗</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Webhook Vista CRM</h3>
                <p className="text-gray-200 mb-6">
                  Integração automática com Vista CRM para receber e processar eventos de imóveis, leads e negociações
                </p>
                <div className="inline-block bg-white text-[#1B489B] px-6 py-2 rounded-lg font-semibold">
                  API Ativa ✓
                </div>
              </div>

              {/* Cron Jobs Service */}
              <div className="bg-gradient-to-br from-[#0C0F24] to-[#1B489B] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Auditoria Automática</h3>
                <p className="text-gray-200 mb-6">
                  Relatórios diários automatizados com detecção de anomalias e alertas por email para gestão proativa
                </p>
                <div className="inline-block bg-white text-[#0C0F24] px-6 py-2 rounded-lg font-semibold">
                  Automatizado ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-[#0C0F24]">
              Recursos Principais
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Tecnologia de ponta para segurança e conformidade
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#1B489B]">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🔍</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[#0C0F24]">Detecção de Anomalias</h4>
                    <p className="text-gray-600">Identificação inteligente de padrões suspeitos em tempo real</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#1B489B]">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[#0C0F24]">Verificação de Matrículas</h4>
                    <p className="text-gray-600">Validação automática de documentos e registros</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#1B489B]">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🛡️</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[#0C0F24]">Anti-Lavagem de Dinheiro</h4>
                    <p className="text-gray-600">Detecção de padrões suspeitos de lavagem de dinheiro</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#1B489B]">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📈</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[#0C0F24]">Análise Comportamental</h4>
                    <p className="text-gray-600">Monitoramento de padrões de atividade de corretores</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#1B489B]">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📧</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[#0C0F24]">Alertas Inteligentes</h4>
                    <p className="text-gray-600">Notificações automáticas por email de atividades suspeitas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#1B489B]">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🔄</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[#0C0F24]">Integração Vista CRM</h4>
                    <p className="text-gray-600">Sincronização automática via webhooks em tempo real</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-[#0C0F24]">
              Tecnologia Moderna e Escalável
            </h2>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <p className="font-semibold text-[#58595B]">Next.js 15</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🗄️</div>
                <p className="font-semibold text-[#58595B]">Supabase</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <p className="font-semibold text-[#58595B]">Vercel</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📧</div>
                <p className="font-semibold text-[#58595B]">Resend</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <p className="font-semibold text-[#58595B]">TailwindCSS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#0C0F24] to-[#1B489B] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Acesse o dashboard e comece a monitorar suas operações imobiliárias agora mesmo
            </p>
            <Link
              href="/dashboard/login"
              className="inline-block bg-white text-[#0C0F24] px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C0F24] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-white font-bold text-2xl tracking-tight">
                e<span className="text-[#1B489B]">X</span>p
              </div>
              <div className="border-l border-gray-600 pl-3">
                <span className="text-white text-lg font-semibold">ImobCheck</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Plataforma Inteligente de Auditoria e Monitoramento de Negócios Imobiliários
            </p>
            <div className="text-gray-500 text-sm">
              <p>Desenvolvido com Next.js, Supabase e Vercel</p>
              <p className="mt-2">© 2026 eXp Realty Brasil. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
