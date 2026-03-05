'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    if (user?.type === 'empresa') {
      router.push('/empresa/painel');
    } else {
      router.push('/centros');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  if (!isAuthenticated) {
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

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Bem-vindo ao ReCiclo!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-2">
              Olá, <strong className="capitalize text-blue-600">{userName}</strong>
            </p>
            <p className="text-lg text-gray-500 mb-8">
              {user?.email}
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Esta é a sua área inicial. Aqui você poderá gerenciar suas atividades de reciclagem,
              acompanhar seu progresso e contribuir para um mundo mais sustentável.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

