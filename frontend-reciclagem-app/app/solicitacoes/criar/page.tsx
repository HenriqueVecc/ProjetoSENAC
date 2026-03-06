'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Navigation } from '@/components/Navigation';
import { Centro } from '@/types';
import { api } from '@/utils/api';

export default function CriarSolicitacaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const [centroId, setCentroId] = useState(searchParams.get('centro') || '');
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('kg');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [dataDesejada, setDataDesejada] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [centros, setCentros] = useState<Centro[]>([]);
  const [materialTypes, setMaterialTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    if (user?.type === 'empresa') {
      router.push('/empresa/painel');
      return;
    }
    
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [centersData, materialsData] = await Promise.all([
          api.getCenters(),
          api.getMaterialTypes(),
        ]);
        
        setCentros(centersData.map((c) => ({
          id: String(c.id),
          nome: c.name,
          endereco: c.address,
          telefone: c.phone,
        })));
        
        setMaterialTypes(materialsData);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
        setErrors({ general: errorMessage });
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!centroId) {
      setErrors((prev) => ({ ...prev, centro: 'Selecione um centro' }));
      return;
    }

    if (!tipoMaterial) {
      setErrors((prev) => ({ ...prev, tipoMaterial: 'Selecione o tipo de material' }));
      return;
    }

    if (!quantidade.trim()) {
      setErrors((prev) => ({ ...prev, quantidade: 'Informe a quantidade estimada' }));
      return;
    }

    const quantidadeNum = parseFloat(quantidade);
    if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
      setErrors((prev) => ({ ...prev, quantidade: 'Quantidade deve ser um número válido maior que zero' }));
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

    if (estado.length !== 2) {
      setErrors((prev) => ({ ...prev, estado: 'Estado deve ter 2 caracteres (UF)' }));
      return;
    }

    if (!dataDesejada) {
      setErrors((prev) => ({ ...prev, dataDesejada: 'Selecione a data desejada' }));
      return;
    }

    setIsLoading(true);

    try {
      const materialType = materialTypes.find((m) => m.name === tipoMaterial);
      if (!materialType) {
        setErrors({ general: 'Tipo de material inválido' });
        setIsLoading(false);
        return;
      }
      
      const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade} - ${estado.toUpperCase()}`;
      
      await api.createRequest({
        center: parseInt(centroId),
        material_type: materialType.id,
        estimated_quantity: parseInt(quantidade),
        quantity_unit: unidade,
        address: enderecoCompleto,
        pickup_date: dataDesejada,
      });
      
      router.push('/solicitacoes/minhas');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar solicitação. Tente novamente.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/signin');
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
        <div className="max-w-2xl mx-auto">
          <Navigation />
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Criar Solicitação de Coleta
            </h1>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Centro <span className="text-red-500">*</span>
                </label>
                <select
                  value={centroId}
                  onChange={(e) => setCentroId(e.target.value)}
                  disabled={isLoadingData}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.centro ? 'border-red-500' : 'border-gray-300'
                  } ${isLoadingData ? 'bg-gray-100' : ''}`}
                >
                  <option value="">{isLoadingData ? 'Carregando...' : 'Selecione um centro'}</option>
                  {centros.map((centro) => (
                    <option key={centro.id} value={centro.id}>
                      {centro.nome}
                    </option>
                  ))}
                </select>
                {errors.centro && (
                  <p className="text-red-500 text-sm mt-1">{errors.centro}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Material <span className="text-red-500">*</span>
                </label>
                <select
                  value={tipoMaterial}
                  onChange={(e) => setTipoMaterial(e.target.value)}
                  disabled={isLoadingData}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tipoMaterial ? 'border-red-500' : 'border-gray-300'
                  } ${isLoadingData ? 'bg-gray-100' : ''}`}
                >
                  <option value="">{isLoadingData ? 'Carregando...' : 'Selecione o tipo de material'}</option>
                  {materialTypes.map((tipo) => (
                    <option key={tipo.id} value={tipo.name}>
                      {tipo.name}
                    </option>
                  ))}
                </select>
                {errors.tipoMaterial && (
                  <p className="text-red-500 text-sm mt-1">{errors.tipoMaterial}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Quantidade Estimada"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="Ex: 10"
                    required
                    error={errors.quantidade}
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidade <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="sacos">sacos</option>
                    <option value="litros">litros</option>
                    <option value="unidades">unidades</option>
                    <option value="caixas">caixas</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Endereço de Coleta</h3>
                
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

                <Input
                  label="Bairro"
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Nome do bairro"
                  required
                  error={errors.bairro}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Cidade"
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Nome da cidade"
                      required
                      error={errors.cidade}
                    />
                  </div>
                  <Input
                    label="Estado (UF)"
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase())}
                    placeholder="SP"
                    required
                    error={errors.estado}
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Desejada <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dataDesejada}
                  onChange={(e) => setDataDesejada(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dataDesejada ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dataDesejada && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataDesejada}</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/centros')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  Enviar Solicitação
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

