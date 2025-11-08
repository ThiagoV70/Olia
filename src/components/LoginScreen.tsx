import { useState } from 'react';
import { ArrowLeft, Droplet, Mail, Lock, User, School, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { UserType } from '../App';

interface LoginScreenProps {
  userType: UserType;
  onLogin: () => void;
  onRegister: () => void;
  onBack: () => void;
}

export default function LoginScreen({ userType, onLogin, onRegister, onBack }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const getUserTypeInfo = () => {
    switch (userType) {
      case 'user':
        return { 
          title: 'Usuário', 
          icon: User, 
          color: '#6B8E23',
          description: 'Acesse sua conta para descartar óleo e ganhar recompensas'
        };
      case 'school':
        return { 
          title: 'Escola', 
          icon: School, 
          color: '#6B8E23',
          description: 'Acesse o painel da instituição'
        };
      case 'government':
        return { 
          title: 'Governo', 
          icon: Building2, 
          color: '#1E4D4C',
          description: 'Acesso restrito a gestores do programa'
        };
      default:
        return { 
          title: '', 
          icon: User, 
          color: '#6B8E23',
          description: ''
        };
    }
  };

  const info = getUserTypeInfo();
  const Icon = info.icon;

  return (
    <div className="min-h-screen bg-[#F4F1ED] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full hover:bg-[#E5E5E5] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1E4D4C]" />
          </button>
          <div className="w-12 h-12 rounded-full bg-[#6B8E23] flex items-center justify-center">
            <Droplet className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-[#1E4D4C]">OLIA</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${info.color}20` }}
            >
              <Icon className="w-10 h-10" style={{ color: info.color }} />
            </div>
            <h2 className="text-[#1E4D4C] mb-2">Entrar como {info.title}</h2>
            <p className="text-[#1E4D4C]/70 text-sm">{info.description}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1E4D4C]">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1E4D4C]">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <button 
                type="button"
                className="text-sm text-[#6B8E23] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-white rounded-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: info.color }}
            >
              Entrar
            </Button>

            {userType !== 'government' && (
              <div className="text-center pt-4 border-t border-[#E5E5E5]">
                <p className="text-[#1E4D4C]/70 text-sm mb-3">
                  Ainda não tem uma conta?
                </p>
                <Button
                  type="button"
                  onClick={onRegister}
                  variant="outline"
                  className="w-full h-12 border-2 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ borderColor: info.color, color: info.color }}
                >
                  Cadastre-se
                </Button>
              </div>
            )}

            {userType === 'government' && (
              <div className="text-center pt-4 border-t border-[#E5E5E5]">
                <p className="text-[#1E4D4C]/60 text-sm">
                  Acesso apenas com credenciais pré-aprovadas
                </p>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
