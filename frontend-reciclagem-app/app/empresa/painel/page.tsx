'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Solicitação } from '@/types';

const MOCK_SOLICITACOES: Solicitação[] = [
  {
    id: '1',
    centroId: '1',
    centroNome: 'Centro de Reciclagem Verde',
    tipoMaterial: 'Plástico',
    quantidade: '15 kg',
    enderecoColeta: 'Rua Exemplo, 123 - Centro, São Paulo - SP',
    dataDesejada: '2024-12-20',
    status: 'pendente',
    usuarioEmail: 'maria@yahoo.com.br',
  },
  {
    id: '2',
    centroId: '1',
    centroNome: 'Centro de Reciclagem Verde',
    tipoMaterial: 'Papel',
    quantidade: '20 kg',
    enderecoColeta: 'Av. Principal, 456 - Bela Vista, São Paulo - SP',
    dataDesejada: '2024-12-18',
    status: 'pendente',
    usuarioEmail: 'joao@example.com',
  },
  {
    id: '3',
    centroId: '1',
    centroNome: 'Centro de Reciclagem Verde',
    tipoMaterial: 'Vidro',
    quantidade: '8 kg',
    enderecoColeta: 'Rua das Flores, 789 - Vila Nova, São Paulo - SP',
    dataDesejada: '2024-12-15',
    status: 'aceita',
    usuarioEmail: 'ana@example.com',
  },
];

export default function PainelEmpresaPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<Solicitação[]>(MOCK_SOLICITACOES);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    if (user?.type === 'usuario') {
      router.push('/centros');
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleAceitar = (id: string) => {
    setSolicitacoes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'aceita' as const } : s))
    );
  };

  const handleRejeitar = (id: string) => {
    setSolicitacoes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejeitada' as const } : s))
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (!isAuthenticated || user?.type === 'usuario') {
    return null;
  }

  const pendentes = solicitacoes.filter((s) => s.status === 'pendente');
  const outras = solicitacoes.filter((s) => s.status !== 'pendente');

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <Image
          src="/img/arteGeral.png"
          alt="ReCiclo - Valorize a Reciclagem"
          fill
          className="object-cover"
          priority
        />
      </div>

      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <span className="text-gray-700 hidden sm:block font-medium">
                Painel da Empresa
              </span>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                title="Sair"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Painel da Empresa
            </h1>
            <p className="text-gray-600">
              Gerencie as solicitações de coleta recebidas
            </p>
          </div>

          {pendentes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Solicitações Pendentes ({pendentes.length})
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Material
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Endereço de Coleta
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Desejada
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendentes.map((solicitacao) => (
                        <tr key={solicitacao.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {solicitacao.tipoMaterial}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{solicitacao.quantidade}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{solicitacao.enderecoColeta}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(solicitacao.dataDesejada)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{solicitacao.usuarioEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAceitar(solicitacao.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                              >
                                Aceitar
                              </button>
                              <button
                                onClick={() => handleRejeitar(solicitacao.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                              >
                                Rejeitar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {outras.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Outras Solicitações
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Material
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Endereço de Coleta
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Desejada
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {outras.map((solicitacao) => (
                        <tr key={solicitacao.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {solicitacao.tipoMaterial}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{solicitacao.quantidade}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{solicitacao.enderecoColeta}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(solicitacao.dataDesejada)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                solicitacao.status === 'aceita'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {solicitacao.status === 'aceita' ? 'Aceita' : 'Rejeitada'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {solicitacoes.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-600 text-lg">
                Nenhuma solicitação recebida ainda
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

