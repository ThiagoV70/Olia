import { useState } from 'react';
import { ArrowLeft, Droplet, User, Mail, Lock, MapPin, CreditCard, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { authApi } from '../services/api';

interface RegisterUserProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function RegisterUser({ onComplete, onBack }: RegisterUserProps) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    password: '',
    confirmPassword: '',
    bolsaFamilia: '',
    hasBolsaFamilia: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.hasBolsaFamilia && !formData.bolsaFamilia) {
      toast.error('Informe o número do Bolsa Família');
      return;
    }

    setLoading(true);
    
    try {
      await authApi.registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        neighborhood: formData.neighborhood || undefined,
        city: formData.city || undefined,
        bolsaFamilia: formData.bolsaFamilia || undefined,
        hasBolsaFamilia: formData.hasBolsaFamilia,
      });
      toast.success('Conta criada com sucesso!');
      onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
      <main className="flex-1 p-6 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#6B8E23]/20 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-[#6B8E23]" />
            </div>
            <h2 className="text-[#1E4D4C] mb-2">Cadastro de Usuário</h2>
            <p className="text-[#1E4D4C]/70 text-sm">
              Preencha seus dados para começar a descartar óleo de forma sustentável
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-[#1E4D4C]">Dados Pessoais</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#1E4D4C]">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-[#1E4D4C]">CPF</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => handleChange('cpf', e.target.value)}
                      className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1E4D4C]">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
              <h3 className="text-[#1E4D4C]">Endereço</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#1E4D4C]">Endereço Completo</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Rua, número, complemento"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="text-[#1E4D4C]">Bairro</Label>
                  <Input
                    id="neighborhood"
                    type="text"
                    placeholder="Seu bairro"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange('neighborhood', e.target.value)}
                    className="h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[#1E4D4C]">Cidade</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Sua cidade"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bolsa Família */}
            <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
              <h3 className="text-[#1E4D4C]">Programa Social</h3>
              
              <div className="flex items-start gap-3 p-4 bg-[#F7C948]/10 rounded-xl">
                <Checkbox
                  id="hasBolsaFamilia"
                  checked={formData.hasBolsaFamilia}
                  onCheckedChange={(checked) => handleChange('hasBolsaFamilia', checked as boolean)}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="hasBolsaFamilia" className="text-[#1E4D4C] cursor-pointer">
                    Sou beneficiário do Bolsa Família
                  </Label>
                  <p className="text-sm text-[#1E4D4C]/70 mt-1">
                    Necessário para receber sabão ecológico como recompensa
                  </p>
                </div>
              </div>

              {formData.hasBolsaFamilia && (
                <div className="space-y-2">
                  <Label htmlFor="bolsaFamilia" className="text-[#1E4D4C]">
                    Número do Bolsa Família (NIS)
                  </Label>
                  <Input
                    id="bolsaFamilia"
                    type="text"
                    placeholder="00000000000"
                    value={formData.bolsaFamilia}
                    onChange={(e) => handleChange('bolsaFamilia', e.target.value)}
                    className="h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required={formData.hasBolsaFamilia}
                  />
                </div>
              )}
            </div>

            {/* Account */}
            <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
              <h3 className="text-[#1E4D4C]">Dados de Acesso</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1E4D4C]">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#1E4D4C]">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#1E4D4C]">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#6B8E23] hover:bg-[#5a7a1e] text-white rounded-xl transition-all hover:scale-[1.02]"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
