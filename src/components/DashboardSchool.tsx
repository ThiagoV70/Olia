import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Droplet,
  TrendingUp,
  Calendar,
  Award,
  Trophy,
  School,
  LogOut,
  CheckCircle,
  Clock,
  Gift,
  Truck,
  Target,
  Users,
  Star,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import AnimatedButton from './AnimatedButton';
import ConfettiEffect from './ConfettiEffect';
import { Notification } from './NotificationBanner';
import { toast } from 'sonner@2.0.3';

interface DashboardSchoolProps {
  onLogout: () => void;
  showNotification: (notification: Notification) => void;
}

export default function DashboardSchool({ onLogout, showNotification }: DashboardSchoolProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [collectionAmount, setCollectionAmount] = useState('');
  const [collectionDate, setCollectionDate] = useState('');

  // Mock data
  const schoolData = {
    name: 'Escola Municipal Santos Dumont',
    totalLiters: 485,
    collections: 32,
    points: 4850,
    capacity: 85,
    ranking: 3,
    nextReward: 5000,
  };

  const rewards = [
    {
      id: 1,
      name: 'Computadores Novos',
      description: '5 computadores para laboratório de informática',
      points: 5000,
      image: '💻',
      available: true,
    },
    {
      id: 2,
      name: 'Ventiladores',
      description: '10 ventiladores para salas de aula',
      points: 3000,
      image: '🌀',
      unlocked: true,
    },
    {
      id: 3,
      name: 'Material de Laboratório',
      description: 'Kit completo de ciências',
      points: 7000,
      image: '🔬',
      available: false,
    },
    {
      id: 4,
      name: 'Livros Didáticos',
      description: '100 livros para biblioteca',
      points: 4000,
      image: '📚',
      unlocked: true,
    },
  ];

  const collectionHistory = [
    {
      id: 1,
      date: '30/09/2025',
      volume: 45,
      points: 450,
      status: 'completed',
    },
    {
      id: 2,
      date: '15/09/2025',
      volume: 38,
      points: 380,
      status: 'completed',
    },
    {
      id: 3,
      date: '05/10/2025',
      volume: 50,
      points: 500,
      status: 'scheduled',
    },
  ];

  const topSchools = [
    { name: 'Escola Estadual Machado de Assis', points: 6200, position: 1 },
    { name: 'Escola Municipal Tiradentes', points: 5800, position: 2 },
    { name: 'Escola Municipal Santos Dumont', points: 4850, position: 3 },
    { name: 'Escola Estadual Dom Pedro', points: 4200, position: 4 },
  ];

  const progressToNext = ((schoolData.points % 5000) / 5000) * 100;
  const capacityPercentage = schoolData.capacity;

  const handleRequestCollection = () => {
    if (!collectionAmount || !collectionDate) {
      toast.error('Preencha todos os campos');
      return;
    }

    toast.success('Coleta solicitada com sucesso!');
    showNotification({
      id: Date.now().toString(),
      type: 'collection',
      message: `Coleta agendada para ${collectionDate} com ${collectionAmount}L estimados`,
    });
    setShowCollectionDialog(false);
    setCollectionAmount('');
    setCollectionDate('');
  };

  const handleRequestReward = (reward: any) => {
    setShowConfetti(true);
    toast.success('Recompensa solicitada!');
    showNotification({
      id: Date.now().toString(),
      type: 'reward',
      message: `Solicitação de ${reward.name} enviada para aprovação`,
    });
    setShowRewardDialog(false);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <div className="h-screen bg-[#F4F1ED] flex flex-col overflow-hidden">
      <ConfettiEffect show={showConfetti} />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm py-4 px-6 flex-shrink-0 z-30"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-full bg-[#1E4D4C] flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <School className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-[#1E4D4C]">OLIA</h1>
              <p className="text-sm text-[#1E4D4C]/70">{schoolData.name}</p>
            </div>
          </div>

          <AnimatedButton
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-2"
            ariaLabel="Sair da conta"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Sair</span>
          </AnimatedButton>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto pb-20">
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="m-0 p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Welcome Banner */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-[#1E4D4C] to-[#6B8E23] rounded-3xl p-8 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="mb-2">Painel da Escola 🎓</h2>
                      <p className="opacity-90">
                        Continue coletando óleo e acumulando recompensas!
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-white/20 px-6 py-3 rounded-2xl">
                      <Trophy className="w-6 h-6" />
                      <div>
                        <div className="text-sm opacity-90">Ranking</div>
                        <div className="text-2xl">{schoolData.ranking}º lugar</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <Droplet className="w-5 h-5 text-[#6B8E23]" />
                          Total Coletado
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                          className="text-4xl text-[#6B8E23]"
                        >
                          {schoolData.totalLiters}L
                        </motion.div>
                        <p className="text-sm text-[#1E4D4C]/60 mt-1">Óleo recebido</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <Truck className="w-5 h-5 text-[#1E4D4C]" />
                          Coletas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                          className="text-4xl text-[#1E4D4C]"
                        >
                          {schoolData.collections}
                        </motion.div>
                        <p className="text-sm text-[#1E4D4C]/60 mt-1">Realizadas</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-none shadow-lg bg-gradient-to-br from-[#F7C948] to-[#f5c034]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Pontos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                          className="text-4xl text-[#1E4D4C]"
                        >
                          {schoolData.points.toLocaleString()}
                        </motion.div>
                        <p className="text-sm text-[#1E4D4C]/80 mt-1">Acumulados</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Capacity and Request Collection */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="border-none shadow-lg h-full">
                      <CardHeader>
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <Target className="w-5 h-5 text-[#6B8E23]" />
                          Capacidade de Armazenamento
                        </CardTitle>
                        <CardDescription>
                          Status atual do reservatório
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[#1E4D4C]">Capacidade Disponível</span>
                            <span className="text-[#6B8E23]">{capacityPercentage}%</span>
                          </div>
                          <Progress value={capacityPercentage} className="h-3" />
                        </div>
                        {capacityPercentage > 80 && (
                          <div className="bg-[#F7C948]/10 border border-[#F7C948] rounded-xl p-4">
                            <p className="text-[#1E4D4C] text-sm flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              Capacidade alta! Considere solicitar uma coleta.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="border-none shadow-lg bg-gradient-to-br from-[#6B8E23] to-[#5a7a1e] text-white h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Truck className="w-5 h-5" />
                          Solicitar Coleta
                        </CardTitle>
                        <CardDescription className="text-white/90">
                          Agende a visita do governo para coleta
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex items-end">
                        <AnimatedButton
                          onClick={() => setShowCollectionDialog(true)}
                          variant="secondary"
                          className="w-full bg-white text-[#6B8E23] hover:bg-white/90"
                          ariaLabel="Solicitar coleta de óleo"
                        >
                          <Calendar className="w-5 h-5 mr-2" />
                          Agendar Coleta
                        </AnimatedButton>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Progress to Next Reward */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#F7C948]" />
                        Progresso para Próxima Recompensa
                      </CardTitle>
                      <CardDescription>
                        Faltam {schoolData.nextReward - schoolData.points} pontos para desbloquear
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progressToNext} className="h-3 mb-2" />
                      <div className="flex justify-between text-sm text-[#1E4D4C]/70">
                        <span>{schoolData.points} pts</span>
                        <span>{schoolData.nextReward} pts</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Recompensas Tab */}
            <TabsContent value="rewards" className="m-0 p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Minhas Recompensas</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">
                    Acumule pontos e desbloqueie melhorias para sua escola
                  </p>
                </motion.div>

                {/* Current Points */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="border-none shadow-lg bg-gradient-to-br from-[#F7C948] to-[#f5c034]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#1E4D4C]/80 mb-1">Pontos Disponíveis</p>
                          <div className="text-4xl text-[#1E4D4C]">{schoolData.points.toLocaleString()}</div>
                        </div>
                        <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center">
                          <Star className="w-10 h-10 text-[#1E4D4C]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewards.map((reward, index) => (
                    <motion.div
                      key={reward.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-none shadow-lg ${reward.unlocked ? 'ring-2 ring-[#6B8E23]' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-[#F4F1ED] flex items-center justify-center text-3xl">
                                {reward.image}
                              </div>
                              <div>
                                <h4 className="text-[#1E4D4C] mb-1">{reward.name}</h4>
                                <p className="text-sm text-[#1E4D4C]/70">{reward.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-[#F7C948]" />
                              <span className="text-[#1E4D4C]">{reward.points} pontos</span>
                            </div>
                            
                            {reward.unlocked ? (
                              <Badge className="bg-[#6B8E23] text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Resgatado
                              </Badge>
                            ) : reward.available ? (
                              <AnimatedButton
                                onClick={() => handleRequestReward(reward)}
                                variant="primary"
                                className="text-sm py-2 px-4"
                                ariaLabel={`Solicitar ${reward.name}`}
                              >
                                Solicitar
                              </AnimatedButton>
                            ) : (
                              <Badge variant="outline" className="text-[#1E4D4C]/50">
                                Bloqueado
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Histórico Tab */}
            <TabsContent value="history" className="m-0 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Histórico de Coletas</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">
                    Acompanhe todas as coletas realizadas
                  </p>
                </motion.div>

                <div className="space-y-4">
                  {collectionHistory.map((collection, index) => (
                    <motion.div
                      key={collection.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-none shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                collection.status === 'completed' ? 'bg-[#6B8E23]/10' : 'bg-[#F7C948]/10'
                              }`}>
                                <Truck className={`w-6 h-6 ${
                                  collection.status === 'completed' ? 'text-[#6B8E23]' : 'text-[#F7C948]'
                                }`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-[#1E4D4C]">Coleta {collection.date}</h4>
                                  {collection.status === 'completed' ? (
                                    <Badge className="bg-[#6B8E23] text-white">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Concluída
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-[#F7C948] text-[#1E4D4C]">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Agendada
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-[#1E4D4C]/70">
                                    <Droplet className="w-3 h-3" />
                                    Volume: {collection.volume}L
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-[#F7C948]">
                                    <Star className="w-3 h-3" />
                                    +{collection.points} pontos
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Ranking Tab */}
            <TabsContent value="ranking" className="m-0 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Ranking de Escolas</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">
                    Veja como sua escola está se saindo
                  </p>
                </motion.div>

                {/* Your Position */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="border-none shadow-lg bg-gradient-to-br from-[#1E4D4C] to-[#6B8E23] text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="opacity-90 mb-1">Sua Posição</p>
                          <h3>{schoolData.ranking}º lugar</h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <Trophy className="w-12 h-12" />
                          <div>
                            <div className="text-3xl">{schoolData.points}</div>
                            <p className="opacity-90 text-sm">pontos</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Top Schools */}
                <div className="space-y-3">
                  {topSchools.map((school, index) => (
                    <motion.div
                      key={school.position}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-none shadow-lg ${
                        school.position === schoolData.ranking ? 'ring-2 ring-[#6B8E23]' : ''
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              school.position === 1 ? 'bg-[#F7C948]' :
                              school.position === 2 ? 'bg-[#E5E5E5]' :
                              school.position === 3 ? 'bg-[#CD7F32]' :
                              'bg-[#F4F1ED]'
                            }`}>
                              <span className={`${
                                school.position <= 3 ? 'text-white' : 'text-[#1E4D4C]'
                              }`}>
                                {school.position}º
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[#1E4D4C]">{school.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-[#1E4D4C]/70">
                                <Star className="w-3 h-3 text-[#F7C948]" />
                                {school.points.toLocaleString()} pontos
                              </div>
                            </div>
                            {school.position === schoolData.ranking && (
                              <Badge className="bg-[#6B8E23] text-white">
                                Você
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white border-t border-[#E5E5E5] py-3 px-4 flex-shrink-0"
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-[#F4F1ED] p-1.5 rounded-2xl h-auto">
              <TabsTrigger
                value="dashboard"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Painel principal"
              >
                <School className="w-5 h-5" />
                <span className="text-xs">Painel</span>
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Recompensas"
              >
                <Gift className="w-5 h-5" />
                <span className="text-xs">Recompensas</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Histórico"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Histórico</span>
              </TabsTrigger>
              <TabsTrigger
                value="ranking"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Ranking"
              >
                <Trophy className="w-5 h-5" />
                <span className="text-xs">Ranking</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>
        </Tabs>
      </main>

      {/* Collection Request Dialog */}
      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E4D4C]">Solicitar Coleta</DialogTitle>
            <DialogDescription>
              Informe a quantidade estimada de óleo e a data preferida
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-[#1E4D4C] mb-2 block">Quantidade Estimada (litros)</label>
              <input
                type="number"
                value={collectionAmount}
                onChange={(e) => setCollectionAmount(e.target.value)}
                placeholder="Ex: 50"
                className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                aria-label="Quantidade de óleo em litros"
              />
            </div>
            <div>
              <label className="text-[#1E4D4C] mb-2 block">Data Preferida</label>
              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                aria-label="Data preferida para coleta"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <AnimatedButton
              onClick={() => setShowCollectionDialog(false)}
              variant="outline"
              className="flex-1"
              ariaLabel="Cancelar solicitação"
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton
              onClick={handleRequestCollection}
              variant="primary"
              className="flex-1"
              ariaLabel="Confirmar solicitação de coleta"
            >
              Solicitar
            </AnimatedButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
