import { useState } from 'react';
import { User, School, Building2, Droplet, Leaf, Recycle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import type { UserType } from '../App';

interface WelcomeScreenProps {
  onSelectUserType: (type: UserType) => void;
}

export default function WelcomeScreen({ onSelectUserType }: WelcomeScreenProps) {
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F1ED] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#6B8E23] flex items-center justify-center">
            <Droplet className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-[#1E4D4C]">OLIA</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <h2 className="text-[#1E4D4C] mb-4">Bem-vindo ao OLIA</h2>
            <p className="text-[#1E4D4C]/80 max-w-xl mx-auto">
              Facilitamos o descarte de óleo usado e recompensamos quem cuida do meio ambiente
            </p>
          </div>

          {/* Icon Features */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#6B8E23]/10 flex items-center justify-center mx-auto mb-3">
                <Droplet className="w-8 h-8 text-[#6B8E23]" />
              </div>
              <p className="text-sm text-[#1E4D4C]/70">Descarte Consciente</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#F7C948]/20 flex items-center justify-center mx-auto mb-3">
                <Recycle className="w-8 h-8 text-[#F7C948]" />
              </div>
              <p className="text-sm text-[#1E4D4C]/70">Transformação</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#1E4D4C]/10 flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-8 h-8 text-[#1E4D4C]" />
              </div>
              <p className="text-sm text-[#1E4D4C]/70">Sustentabilidade</p>
            </div>
          </div>

          {/* User Type Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => onSelectUserType('user')}
              className="w-full h-auto py-6 bg-[#6B8E23] hover:bg-[#5a7a1e] text-white rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <p className="text-lg">Sou Usuário</p>
                  <p className="text-sm opacity-90">Descarte óleo e ganhe recompensas</p>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => onSelectUserType('school')}
              className="w-full h-auto py-6 bg-[#6B8E23] hover:bg-[#5a7a1e] text-white rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <School className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <p className="text-lg">Sou Escola</p>
                  <p className="text-sm opacity-90">Ponto de coleta e educação ambiental</p>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => onSelectUserType('government')}
              className="w-full h-auto py-6 bg-[#1E4D4C] hover:bg-[#163936] text-white rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <p className="text-lg">Sou Governo</p>
                  <p className="text-sm opacity-90">Gestão e monitoramento do programa</p>
                </div>
              </div>
            </Button>
          </div>

          {/* Learn More Link */}
          <div className="text-center mt-8">
            <button
              onClick={() => setShowInfoDialog(true)}
              className="text-[#6B8E23] hover:underline transition-all"
            >
              Saiba mais sobre o projeto OLIA
            </button>
          </div>
        </div>
      </main>

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="bg-white border-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1E4D4C] flex items-center gap-2">
              <Leaf className="w-6 h-6 text-[#6B8E23]" />
              Sobre o Projeto OLIA
            </DialogTitle>
            <DialogDescription className="text-[#1E4D4C]/80 space-y-4 pt-4">
              <div className="space-y-3">
                <p>
                  O OLIA é uma iniciativa que conecta governo, escolas públicas e população 
                  para promover o descarte consciente de óleo de cozinha usado.
                </p>
                
                <div className="bg-[#F4F1ED] p-4 rounded-lg">
                  <h4 className="text-[#1E4D4C] mb-2">Impacto Ambiental do Óleo</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#F7C948] mt-1">•</span>
                      <span>1 litro de óleo contamina até 1 milhão de litros de água</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F7C948] mt-1">•</span>
                      <span>Entope redes de esgoto e prejudica tratamento de água</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F7C948] mt-1">•</span>
                      <span>Dificulta a oxigenação de rios e oceanos</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#6B8E23]/10 p-4 rounded-lg">
                  <h4 className="text-[#1E4D4C] mb-2">Nossa Solução</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#6B8E23] mt-1">✓</span>
                      <span>Transformamos óleo usado em sabão ecológico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#6B8E23] mt-1">✓</span>
                      <span>Beneficiamos famílias de baixa renda cadastradas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#6B8E23] mt-1">✓</span>
                      <span>Fortalecemos a educação ambiental nas escolas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#6B8E23] mt-1">✓</span>
                      <span>Criamos uma rede sustentável de coleta e recompensa</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm italic">
                  Juntos, podemos transformar um problema ambiental em solução sustentável!
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
