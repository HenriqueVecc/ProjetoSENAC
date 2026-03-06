'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { validateEmail, validatePassword } from '@/utils/validation';

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'usuario' | 'empresa'>('usuario');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email é obrigatório' }));
      return;
    }

    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Email inválido' }));
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Senha é obrigatória' }));
      return;
    }

    if (!validatePassword(password)) {
      setErrors((prev) => ({ ...prev, password: 'Senha deve ter pelo menos 4 caracteres' }));
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/home');
      } else {
        setErrors({ general: 'Email ou senha incorretos' });
      }
    } catch {
      setErrors({ general: 'Erro ao fazer login. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-start">
        <div className="w-full max-w-md">
          <div className="mb-4  ">
            <Logo />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">Acessar sua conta</h1>
            </div>

            <p className="text-gray-600 mb-6">
              Entre com seu email e senha para continuar
            </p>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de conta <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="usuario"
                      checked={userType === 'usuario'}
                      onChange={(e) => setUserType(e.target.value as 'usuario' | 'empresa')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Usuário</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="empresa"
                      checked={userType === 'empresa'}
                      onChange={(e) => setUserType(e.target.value as 'usuario' | 'empresa')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Empresa</span>
                  </label>
                </div>
              </div>

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="me@example.com"
                required
                error={errors.email}
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  
                </div>
                <Input
                  label=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  required
                  error={errors.password}
                  showPasswordToggle
                  isPasswordVisible={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              </div>

              <Button type="submit" isLoading={isLoading}>
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <a
                  href="/signup"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/signup');
                  }}
                >
                  Cadastre-se
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative overflow-hidden hidden lg:flex">
        <Image
          src="/img/arteFundo.png"
          alt="Arte Geral"
          fill
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  );
}

