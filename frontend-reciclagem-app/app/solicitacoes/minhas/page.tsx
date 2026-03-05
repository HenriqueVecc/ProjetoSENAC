'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Navigation } from '@/components/Navigation';
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
    centroId: '2',
    centroNome: 'EcoRecicla',
    tipoMaterial: 'Papel',
    quantidade: '20 kg',
    enderecoColeta: 'Rua Exemplo, 123 - Centro, São Paulo - SP',
    dataDesejada: '2024-12-18',
    status: 'aceita',
    usuarioEmail: 'maria@yahoo.com.br',
  },
  {
    id: '3',
    centroId: '3',
    centroNome: 'Recicla Mais',
    tipoMaterial: 'Vidro',
    quantidade: '8 kg',
    enderecoColeta: 'Rua Exemplo, 123 - Centro, São Paulo - SP',
    dataDesejada: '2024-12-15',
    status: 'rejeitada',
    usuarioEmail: 'maria@yahoo.com.br',
  },
];

const getStatusColor = (status: Solicitação['status']) => {
  switch (status) {
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'aceita':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejeitada':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: Solicitação['status']) => {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'aceita':
      return 'Aceita';
    case 'rejeitada':
      return 'Rejeitada';
    default:
      return status;
  }
};

export default function MinhasSolicitacoesPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [solicitacoes] = useState<Solicitação[]>(MOCK_SOLICITACOES);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    if (user?.type === 'empresa') {
      router.push('/empresa/painel');
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (!isAuthenticated || user?.type === 'empresa') {
    return null;
  }

  const userName = user?.email?.split('@')[0] || 'Usuário';

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
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm capitalize">
                    {userName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  Olá, <strong className="capitalize text-gray-900">{userName}</strong>
                </span>
              </div>
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
          <Navigation />
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Minhas Solicitações
              </h1>
              <p className="text-gray-600">
                Acompanhe o status das suas solicitações de coleta
              </p>
            </div>
            <div className="flex items-center gap-2">
            <Button 
              onClick={() => router.push('/solicitacoes/criar')}
              className=" px-4 py-2 text-sm"
            >
              Nova Solicitação
            </Button>
            </div>
           
          </div>

          {solicitacoes.length === 0 ? (
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
              <p className="text-gray-600 text-lg mb-4">Você ainda não possui solicitações</p>
              <Button onClick={() => router.push('/centros')}>
                Ver Centros de Reciclagem
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Centro
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {solicitacoes.map((solicitacao) => (
                      <tr key={solicitacao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {solicitacao.centroNome}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{solicitacao.tipoMaterial}</div>
                          <div className="text-sm text-gray-500">{solicitacao.quantidade}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(solicitacao.dataDesejada)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              solicitacao.status
                            )}`}
                          >
                            {getStatusLabel(solicitacao.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

