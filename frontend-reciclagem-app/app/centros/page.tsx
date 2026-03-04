'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Navigation } from '@/components/Navigation';
import { Centro } from '@/types';

const MOCK_CENTROS: Centro[] = [
  {
    id: '1',
    nome: 'Centro de Reciclagem Verde',
    endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    telefone: '(11) 3456-7890',
  },
  {
    id: '2',
    nome: 'EcoRecicla',
    endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    telefone: '(11) 9876-5432',
  },
  {
    id: '3',
    nome: 'Recicla Mais',
    endereco: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
    telefone: '(11) 2345-6789',
  },
  {
    id: '4',
    nome: 'Centro Sustentável',
    endereco: 'Rua dos Três Irmãos, 200 - Butantã, São Paulo - SP',
    telefone: '(11) 4567-8901',
  },
];

export default function CentrosPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [centros] = useState<Centro[]>(MOCK_CENTROS);

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

  const handleSolicitarColeta = (centroId: string) => {
    router.push(`/solicitacoes/criar?centro=${centroId}`);
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Centros de Reciclagem
            </h1>
            <p className="text-gray-600">
              Escolha um centro e solicite a coleta dos seus materiais recicláveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centros.map((centro) => (
              <div
                key={centro.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{centro.nome}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm">{centro.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-sm">{centro.telefone}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleSolicitarColeta(centro.id)}
                  className="w-full"
                >
                  Solicitar Coleta
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

