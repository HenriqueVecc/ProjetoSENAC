export interface User {
  email: string;
  name?: string;
  type: 'usuario' | 'empresa';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Centro {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
}

export interface Solicitação {
  id: string;
  centroId: string;
  centroNome: string;
  tipoMaterial: string;
  quantidade: string;
  enderecoColeta: string;
  dataDesejada: string;
  status: 'pendente' | 'aceita' | 'rejeitada';
  usuarioEmail?: string;
  usuarioNome?: string;
}

