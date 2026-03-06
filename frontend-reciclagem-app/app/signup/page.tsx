'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { validateEmail, validatePassword } from '@/utils/validation';
import { api } from '@/utils/api';
import { applyPhoneMask, removePhoneMask } from '@/utils/phoneMask';

export default function SignUpPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'usuario' | 'empresa'>('usuario');
  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!nome.trim()) {
      setErrors((prev) => ({ ...prev, nome: 'Nome é obrigatório' }));
      return;
    }

    if (!rua.trim()) {
      setErrors((prev) => ({ ...prev, rua: 'Rua é obrigatória' }));
      return;
    }

    if (!numero.trim()) {
      setErrors((prev) => ({ ...prev, numero: 'Número é obrigatório' }));
      return;
    }

    if (!bairro.trim()) {
      setErrors((prev) => ({ ...prev, bairro: 'Bairro é obrigatório' }));
      return;
    }

    if (!cidade.trim()) {
      setErrors((prev) => ({ ...prev, cidade: 'Cidade é obrigatória' }));
      return;
    }

    if (!estado.trim()) {
      setErrors((prev) => ({ ...prev, estado: 'Estado é obrigatório' }));
      return;
    }

    if (userType === 'empresa') {
      if (!telefone.trim()) {
        setErrors((prev) => ({ ...prev, telefone: 'Telefone é obrigatório para empresas' }));
        return;
      }
      const phoneNumbers = removePhoneMask(telefone);
      if (phoneNumbers.length < 10) {
        setErrors((prev) => ({ ...prev, telefone: 'Telefone deve ter pelo menos 10 dígitos' }));
        return;
      }
    }

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
      const address = `${rua}, ${numero} - ${bairro}, ${cidade} - ${estado}`;
      const type = userType === 'empresa' ? 'CENTER' : 'USER';
      
      if (userType === 'empresa') {
        const phoneWithoutMask = removePhoneMask(telefone);
        await api.register(nome, email, password, type, {
          name: nome,
          address: address,
          phone: phoneWithoutMask,
          description: '',
        });
      } else {
        await api.register(nome, email, password, type);
      }
      
      router.push('/signin?registered=true');
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao realizar cadastro. Tente novamente.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white flex items-center justify-center ">
      <div className="w-full max-w-2xl">
        <div >
          <Logo />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100 mx-auto">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">Criar conta</h1>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-6">
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
                label="Nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={userType === 'empresa' ? 'Nome da empresa' : 'Seu nome completo'}
                required
                error={errors.nome}
              />

              <div className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Rua"
                      type="text"
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                      placeholder="Nome da rua"
                      required
                      error={errors.rua}
                    />
                  </div>
                  <Input
                    label="Número"
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="123"
                    required
                    error={errors.numero}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="CEP"
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    required
                    error={errors.cep}
                  />
                  <Input
                    label="Bairro"
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Nome do bairro"
                    required
                    error={errors.bairro}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Cidade"
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Nome da cidade"
                    required
                    error={errors.cidade}
                  />
                  <Input
                    label="Estado"
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="UF"
                    required
                    error={errors.estado}
                    maxLength={2}
                  />
                </div>
                
                {userType === 'empresa' && (
                  <Input
                    label="Telefone"
                    type="text"
                    value={telefone}
                    onChange={(e) => {
                      const masked = applyPhoneMask(e.target.value);
                      setTelefone(masked);
                    }}
                    placeholder="(11) 99999-9999"
                    required
                    error={errors.telefone}
                    maxLength={15}
                  />
                )}
              </div>

              <div className="space-y-4 mt-6">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  error={errors.email}
                />

                <div>
                  <Input
                    label="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                    error={errors.password}
                    showPasswordToggle
                    isPasswordVisible={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>

              <Button type="submit" isLoading={isLoading} className="mt-6">
                Cadastrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href="/signin"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

