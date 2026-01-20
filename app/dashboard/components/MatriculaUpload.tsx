'use client';

import { useState } from 'react';

interface MatriculaUploadProps {
  imovelId: string;
  imovelEndereco: string;
  onSuccess?: () => void;
}

export function MatriculaUpload({ imovelId, imovelEndereco, onSuccess }: MatriculaUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [numeroMatricula, setNumeroMatricula] = useState('');
  const [cartorio, setCartorio] = useState('');
  const [cidade, setCidade] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tipo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Apenas arquivos PDF, JPEG e PNG são permitidos');
        setFile(null);
        return;
      }

      // Validar tamanho (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Arquivo muito grande. Máximo: 10MB');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo');
      return;
    }

    if (!numeroMatricula) {
      setError('Informe o número da matrícula');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Upload do arquivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imovel_id', imovelId);

      const uploadResponse = await fetch('/api/matricula/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Erro ao fazer upload');
      }

      // 2. Registrar verificação
      const checkResponse = await fetch('/api/matricula/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imovel_id: imovelId,
          numero_matricula: numeroMatricula,
          cartorio: cartorio || undefined,
          cidade: cidade || undefined,
        }),
      });

      const checkResult = await checkResponse.json();

      if (!checkResponse.ok) {
        throw new Error(checkResult.error || 'Erro ao verificar matrícula');
      }

      setSuccess('Matrícula enviada e verificada com sucesso!');
      setFile(null);
      setNumeroMatricula('');
      setCartorio('');
      setCidade('');

      // Limpar input de arquivo
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar matrícula');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-[#0C0F24]">
        Upload de Matrícula
      </h3>
      
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Imóvel:</strong> {imovelEndereco}
        </p>
      </div>

      <div className="space-y-4">
        {/* Número da Matrícula */}
        <div>
          <label htmlFor="numero-matricula" className="block text-sm font-medium text-gray-700 mb-1">
            Número da Matrícula *
          </label>
          <input
            type="text"
            id="numero-matricula"
            value={numeroMatricula}
            onChange={(e) => setNumeroMatricula(e.target.value)}
            placeholder="Ex: 12345"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
            disabled={uploading}
          />
        </div>

        {/* Cartório */}
        <div>
          <label htmlFor="cartorio" className="block text-sm font-medium text-gray-700 mb-1">
            Cartório (opcional)
          </label>
          <input
            type="text"
            id="cartorio"
            value={cartorio}
            onChange={(e) => setCartorio(e.target.value)}
            placeholder="Ex: 1º Registro de Imóveis"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
            disabled={uploading}
          />
        </div>

        {/* Cidade */}
        <div>
          <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
            Cidade (opcional)
          </label>
          <input
            type="text"
            id="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: São Paulo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
            disabled={uploading}
          />
        </div>

        {/* Upload de Arquivo */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
            Documento da Matrícula (PDF, JPEG ou PNG) *
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B489B]"
            disabled={uploading}
          />
          {file && (
            <p className="mt-1 text-sm text-gray-600">
              Arquivo selecionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Mensagens */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Botão */}
        <button
          onClick={handleUpload}
          disabled={uploading || !file || !numeroMatricula}
          className="w-full px-4 py-3 bg-[#1B489B] text-white rounded-md hover:bg-[#0C0F24] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {uploading ? 'Enviando...' : 'Enviar Matrícula'}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Nota:</strong> O documento será armazenado de forma segura e associado ao imóvel.
          Apenas arquivos PDF, JPEG e PNG de até 10MB são aceitos.
        </p>
      </div>
    </div>
  );
}

export function MatriculaStatus({ imovelId }: { imovelId: string }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);

  useState(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/matricula/check?imovel_id=${imovelId}`);
        const data = await response.json();
        if (response.ok) {
          setStatus(data.data);
        }
      } catch (error) {
        console.error('Erro ao buscar status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  });

  if (loading) {
    return <div className="text-sm text-gray-600">Carregando...</div>;
  }

  if (!status) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h4 className="font-semibold text-sm mb-2 text-gray-900">Status da Matrícula</h4>
      <div className="space-y-1 text-sm">
        <p className="text-gray-600">
          <strong>Número:</strong> {status.matricula || 'Não informado'}
        </p>
        <p className="text-gray-600">
          <strong>Verificada:</strong>{' '}
          {status.matricula_verificada ? (
            <span className="text-green-600 font-semibold">Sim</span>
          ) : (
            <span className="text-red-600 font-semibold">Não</span>
          )}
        </p>
        {status.matricula_verificada_em && (
          <p className="text-gray-600">
            <strong>Data de Verificação:</strong>{' '}
            {new Date(status.matricula_verificada_em).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
    </div>
  );
}
