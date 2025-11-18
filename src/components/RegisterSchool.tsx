import { useState } from 'react';
import { ArrowLeft, Droplet, School, Mail, Lock, MapPin, Building, Phone, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { authApi } from '../services/api';

interface RegisterSchoolProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function RegisterSchool({ onComplete, onBack }: RegisterSchoolProps) {
  const [formData, setFormData] = useState({
    schoolName: '',
    cnpj: '',
    address: '',
    neighborhood: '',
    city: '',
    responsibleName: '',
    responsiblePhone: '',
    responsibleEmail: '',
    storageCapacity: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    
    try {
      await authApi.registerSchool({
        schoolName: formData.schoolName,
        cnpj: formData.cnpj,
        email: formData.responsibleEmail,
        password: formData.password,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        responsibleName: formData.responsibleName,
        responsiblePhone: formData.responsiblePhone,
        responsibleEmail: formData.responsibleEmail,
        storageCapacity: formData.storageCapacity,
      });
      toast.success('Escola cadastrada com sucesso!');
      onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar escola');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
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
              <School className="w-10 h-10 text-[#6B8E23]" />
            </div>
            <h2 className="text-[#1E4D4C] mb-2">Cadastro de Escola</h2>
            <p className="text-[#1E4D4C]/70 text-sm">
              Registre sua instituição para se tornar um ponto de coleta OLIA
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg space-y-6">
            {/* School Info */}
            <div className="space-y-4">
              <h3 className="text-[#1E4D4C]">Dados da Instituição</h3>
              
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-[#1E4D4C]">Nome da Escola</Label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                  <Input
                    id="schoolName"
                    type="text"
                    placeholder="Nome completo da instituição"
                    value={formData.schoolName}
                    onChange={(e) => handleChange('schoolName', e.target.value)}
                    className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-[#1E4D4C]">CNPJ</Label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                  <Input
                    id="cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => handleChange('cnpj', e.target.value)}
                    className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
              <h3 className="text-[#1E4D4C]">Localização</h3>
              
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
                    placeholder="Bairro da escola"
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
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageCapacity" className="text-[#1E4D4C]">
                  Capacidade de Armazenamento
                </Label>
                <Select 
                  value={formData.storageCapacity} 
                  onValueChange={(value) => handleChange('storageCapacity', value)}
                >
                  <SelectTrigger className="h-12 bg-[#F4F1ED] border-none rounded-xl">
                    <SelectValue placeholder="Selecione a capacidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequena (até 50 litros)</SelectItem>
                    <SelectItem value="medium">Média (50-100 litros)</SelectItem>
                    <SelectItem value="large">Grande (100-200 litros)</SelectItem>
                    <SelectItem value="xlarge">Muito Grande (mais de 200 litros)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Responsible Person */}
            <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
              <h3 className="text-[#1E4D4C]">Responsável pelo Programa</h3>
              
              <div className="space-y-2">
                <Label htmlFor="responsibleName" className="text-[#1E4D4C]">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                  <Input
                    id="responsibleName"
                    type="text"
                    placeholder="Nome do responsável"
                    value={formData.responsibleName}
                    onChange={(e) => handleChange('responsibleName', e.target.value)}
                    className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsiblePhone" className="text-[#1E4D4C]">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                    <Input
                      id="responsiblePhone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.responsiblePhone}
                      onChange={(e) => handleChange('responsiblePhone', e.target.value)}
                      className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibleEmail" className="text-[#1E4D4C]">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E4D4C]/40" />
                    <Input
                      id="responsibleEmail"
                      type="email"
                      placeholder="email@escola.com"
                      value={formData.responsibleEmail}
                      onChange={(e) => handleChange('responsibleEmail', e.target.value)}
                      className="pl-12 h-12 bg-[#F4F1ED] border-none rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
              <h3 className="text-[#1E4D4C]">Senha de Acesso</h3>
              
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

            <div className="p-4 bg-[#F7C948]/10 rounded-xl">
              <p className="text-sm text-[#1E4D4C]/70">
                Após o cadastro, sua escola será avaliada pela equipe do programa OLIA. 
                Você receberá um e-mail de confirmação em até 48 horas.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#6B8E23] hover:bg-[#5a7a1e] text-white rounded-xl transition-all hover:scale-[1.02]"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Escola'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
