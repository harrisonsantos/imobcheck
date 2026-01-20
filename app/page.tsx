import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            ImobCheck
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Plataforma Inteligente de Monitoramento de Negócios Imobiliários
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">Detecção de Anomalias</h3>
              <p className="text-gray-600">
                Identificação automática de padrões suspeitos em negociações
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Dashboard Completo</h3>
              <p className="text-gray-600">
                Acompanhe leads, negócios e corretores em tempo real
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-lg font-semibold mb-2">Alertas Inteligentes</h3>
              <p className="text-gray-600">
                Notificações por email sobre atividades suspeitas
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Acessar Dashboard
            </Link>
            <a
              href="https://github.com/harrisonsantos/imobcheck"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Ver no GitHub
            </a>
          </div>

          {/* Features List */}
          <div className="bg-white p-8 rounded-lg shadow-md text-left">
            <h2 className="text-2xl font-bold mb-4 text-center">Recursos Principais</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Integração com Vista CRM via webhooks</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Verificação automática de matrículas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Detecção de padrões de lavagem de dinheiro</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Análise comportamental de corretores</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Relatórios diários por email</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Auditoria automática via cron jobs</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-12 text-gray-600">
            <p>Desenvolvido com Next.js, Supabase e Vercel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
