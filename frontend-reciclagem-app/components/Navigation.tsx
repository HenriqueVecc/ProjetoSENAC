'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  if (user?.type === 'empresa') {
    return null; 
  }

  const navItems = [
    { path: '/centros', label: 'Centros', icon: '🏢' },
    { path: '/solicitacoes/minhas', label: 'Minhas Solicitações', icon: '📋' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-md rounded-lg mb-6">
      <div className="flex items-center justify-center gap-4 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

