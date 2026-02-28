'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

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
      <div className="absolute inset-0 opacity-30">
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
            <div className="flex items-center gap-4">
              <span className="text-gray-700 hidden sm:block">
                Olá, <strong className="capitalize">{userName}</strong>
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
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

