import { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  BarChart3,
  Award,
  Send,
  LogOut,
  Shield,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Droplet,
  Users,
  School,
  TrendingUp,
  Package,
  Truck,
  Star,
  Download,
  Map as MapIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import AnimatedButton from './AnimatedButton';
import { Notification } from './NotificationBanner';
import { toast } from 'sonner@2.0.3';

interface DashboardGovernmentProps {
  onLogout: () => void;
  showNotification: (notification: Notification) => void;
}

interface SchoolData {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  totalCollected: number;
  lastCollection: string;
  points: number;
  status: 'pending' | 'scheduled' | 'completed';
  requestedLiters?: number;
  preferredDate?: string;
  lat: number;
  lng: number;
}

interface RewardRequest {
  id: number;
  schoolName: string;
  rewardName: string;
  points: number;
  date: string;
  status: 'pending' | 'approved' | 'denied';
}

export default function DashboardGovernment({ onLogout, showNotification }: DashboardGovernmentProps) {
  const [activeTab, setActiveTab] = useState('collections');
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [collectedLiters, setCollectedLiters] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const globalStats = {
    totalOilRecycled: 15750,
    soapProduced: 3150,
    participatingSchools: 42,
    beneficiaries: 890,
  };

  const schools: SchoolData[] = [
    {
      id: 1,
      name: 'Escola Municipal Santos Dumont',
      address: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      totalCollected: 1250,
      lastCollection: '30/09/2025',
      points: 4850,
      status: 'pending',
      requestedLiters: 150,
      preferredDate: '15/10/2025',
      lat: -23.55,
      lng: -46.63,
    },
    {
      id: 2,
      name: 'Escola Estadual Machado de Assis',
      address: 'Av. Principal, 456',
      neighborhood: 'Jardim América',
      city: 'São Paulo',
      totalCollected: 980,
      lastCollection: '28/09/2025',
      points: 5800,
      status: 'scheduled',
      lat: -23.56,
      lng: -46.64,
    },
    {
      id: 3,
      name: 'Escola Municipal Tiradentes',
      address: 'Rua da Paz, 789',
      neighborhood: 'Vila Nova',
      city: 'Guarulhos',
      totalCollected: 1450,
      lastCollection: '25/09/2025',
      points: 6200,
      status: 'completed',
      lat: -23.57,
      lng: -46.65,
    },
  ];

  const rewardRequests: RewardRequest[] = [
    {
      id: 1,
      schoolName: 'Escola Municipal Santos Dumont',
      rewardName: 'Computadores Novos',
      points: 5000,
      date: '05/10/2025',
      status: 'pending',
    },
    {
      id: 2,
      schoolName: 'Escola Municipal Tiradentes',
      rewardName: 'Livros Didáticos',
      points: 4000,
      date: '03/10/2025',
      status: 'pending',
    },
  ];

  const filteredSchools = schools.filter((school) => {
    if (filterCity !== 'all' && school.city !== filterCity) return false;
    if (filterStatus !== 'all' && school.status !== filterStatus) return false;
    return true;
  });

  const pendingCollections = schools.filter((s) => s.status === 'pending');
  const scheduledCollections = schools.filter((s) => s.status === 'scheduled');
  const completedCollections = schools.filter((s) => s.status === 'completed');

  const handleCompleteCollection = () => {
    if (!collectedLiters) {
      toast.error('Informe a quantidade coletada');
      return;
    }

    toast.success('Coleta concluída com sucesso!');
    showNotification({
      id: Date.now().toString(),
      type: 'success',
      message: `Coleta de ${collectedLiters}L registrada com sucesso`,
    });
    setShowCollectionModal(false);
    setCollectedLiters('');
    setSelectedSchool(null);
  };

  const handleSendMessage = () => {
    if (!messageTitle || !messageContent) {
      toast.error('Preencha todos os campos');
      return;
    }

    toast.success('Mensagem enviada com sucesso!');
    showNotification({
      id: Date.now().toString(),
      type: 'info',
      message: 'Notificação enviada para todas as escolas',
    });
    setShowMessageModal(false);
    setMessageTitle('');
    setMessageContent('');
  };

  const handleApproveReward = (request: RewardRequest) => {
    toast.success('Recompensa aprovada!');
    showNotification({
      id: Date.now().toString(),
      type: 'reward',
      message: `${request.rewardName} aprovado para ${request.schoolName}`,
    });
  };

  const handleDenyReward = (request: RewardRequest) => {
    toast.error('Recompensa negada');
  };

  const topSchools = [...schools].sort((a, b) => b.points - a.points).slice(0, 5);

  return (
    <div className="h-screen bg-[#F4F1ED] flex flex-col overflow-hidden">
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
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-[#1E4D4C]">OLIA</h1>
              <p className="text-sm text-[#1E4D4C]/70">Painel do Governo</p>
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
            {/* Controle de Coletas Tab */}
            <TabsContent value="collections" className="m-0 p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Controle de Coletas</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">Gerencie todas as solicitações de coleta</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[#F7C948]" />
                          Pendentes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl text-[#F7C948]">{pendingCollections.length}</div>
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
                          Agendadas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl text-[#1E4D4C]">{scheduledCollections.length}</div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-[#6B8E23]" />
                          Concluídas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl text-[#6B8E23]">{completedCollections.length}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Collection Lists */}
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-3 bg-white">
                    <TabsTrigger value="pending">Pendentes</TabsTrigger>
                    <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
                    <TabsTrigger value="completed">Concluídas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending" className="space-y-4 mt-6">
                    {pendingCollections.map((school, index) => (
                      <motion.div
                        key={school.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-none shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-[#1E4D4C] mb-2">{school.name}</h4>
                                <div className="space-y-1 text-sm text-[#1E4D4C]/70">
                                  <p>{school.address}</p>
                                  <p>Quantidade estimada: {school.requestedLiters}L</p>
                                  <p>Data preferida: {school.preferredDate}</p>
                                </div>
                              </div>
                              <Badge className="bg-[#F7C948] text-[#1E4D4C]">
                                <Clock className="w-3 h-3 mr-1" />
                                Pendente
                              </Badge>
                            </div>
                            <div className="flex gap-3">
                              <AnimatedButton
                                onClick={() => {
                                  setSelectedSchool(school);
                                  setShowCollectionModal(true);
                                }}
                                variant="primary"
                                className="flex-1"
                                ariaLabel="Agendar coleta"
                              >
                                Agendar Coleta
                              </AnimatedButton>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="scheduled" className="space-y-4 mt-6">
                    {scheduledCollections.map((school, index) => (
                      <motion.div
                        key={school.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-none shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-[#1E4D4C] mb-2">{school.name}</h4>
                                <div className="space-y-1 text-sm text-[#1E4D4C]/70">
                                  <p>{school.address}</p>
                                  <p>Última coleta: {school.lastCollection}</p>
                                </div>
                              </div>
                              <Badge className="bg-[#1E4D4C] text-white">
                                <Truck className="w-3 h-3 mr-1" />
                                Agendada
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-6">
                    {completedCollections.map((school, index) => (
                      <motion.div
                        key={school.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-none shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-[#1E4D4C] mb-2">{school.name}</h4>
                                <div className="space-y-1 text-sm text-[#1E4D4C]/70">
                                  <p>{school.address}</p>
                                  <p>Total coletado: {school.totalCollected}L</p>
                                </div>
                              </div>
                              <Badge className="bg-[#6B8E23] text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Concluída
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* Impacto Ambiental Tab */}
            <TabsContent value="impact" className="m-0 p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Impacto Ambiental</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">Estatísticas gerais do programa</p>
                </motion.div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <Droplet className="w-5 h-5 text-[#6B8E23]" />
                          Óleo Reciclado
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl text-[#6B8E23]">
                          {globalStats.totalOilRecycled.toLocaleString()}L
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <Package className="w-5 h-5 text-[#F7C948]" />
                          Sabão Produzido
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl text-[#F7C948]">
                          {globalStats.soapProduced.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <School className="w-5 h-5 text-[#1E4D4C]" />
                          Escolas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl text-[#1E4D4C]">
                          {globalStats.participatingSchools}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#6B8E23]" />
                          Beneficiários
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl text-[#6B8E23]">
                          {globalStats.beneficiaries.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Top Schools Ranking */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#6B8E23]" />
                        Ranking de Escolas
                      </CardTitle>
                      <CardDescription>Escolas com maior pontuação</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {topSchools.map((school, index) => (
                        <div key={school.id} className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === 0
                                ? 'bg-[#F7C948]'
                                : index === 1
                                ? 'bg-[#E5E5E5]'
                                : index === 2
                                ? 'bg-[#CD7F32]'
                                : 'bg-[#F4F1ED]'
                            }`}
                          >
                            <span
                              className={
                                index <= 2 ? 'text-white font-bold' : 'text-[#1E4D4C]'
                              }
                            >
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[#1E4D4C]">{school.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-[#1E4D4C]/70">
                              <Star className="w-3 h-3 text-[#F7C948]" />
                              {school.points.toLocaleString()} pontos
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                <AnimatedButton
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  ariaLabel="Exportar relatório"
                >
                  <Download className="w-4 h-4" />
                  Exportar Relatório
                </AnimatedButton>
              </div>
            </TabsContent>

            {/* Gestão de Recompensas Tab */}
            <TabsContent value="rewards" className="m-0 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Gestão de Recompensas</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">
                    Aprove ou negue solicitações de recompensas
                  </p>
                </motion.div>

                <div className="space-y-4">
                  {rewardRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-none shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-[#1E4D4C] mb-2">{request.schoolName}</h4>
                              <div className="space-y-1">
                                <p className="text-[#1E4D4C]">{request.rewardName}</p>
                                <div className="flex items-center gap-2 text-sm text-[#1E4D4C]/70">
                                  <Star className="w-3 h-3 text-[#F7C948]" />
                                  {request.points} pontos
                                </div>
                                <p className="text-sm text-[#1E4D4C]/70">
                                  Solicitado em: {request.date}
                                </p>
                              </div>
                            </div>
                            {request.status === 'pending' ? (
                              <Badge className="bg-[#F7C948] text-[#1E4D4C]">Pendente</Badge>
                            ) : request.status === 'approved' ? (
                              <Badge className="bg-[#6B8E23] text-white">Aprovado</Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600">
                                Negado
                              </Badge>
                            )}
                          </div>
                          {request.status === 'pending' && (
                            <div className="flex gap-3">
                              <AnimatedButton
                                onClick={() => handleApproveReward(request)}
                                variant="primary"
                                className="flex-1 flex items-center justify-center gap-2"
                                ariaLabel="Aprovar recompensa"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Aprovar
                              </AnimatedButton>
                              <AnimatedButton
                                onClick={() => handleDenyReward(request)}
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                ariaLabel="Negar recompensa"
                              >
                                <XCircle className="w-4 h-4" />
                                Negar
                              </AnimatedButton>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Comunicação Tab */}
            <TabsContent value="communication" className="m-0 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Comunicação</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">
                    Envie notificações para escolas e usuários
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-[#1E4D4C]">Nova Mensagem</CardTitle>
                      <CardDescription>
                        Envie atualizações e avisos importantes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-[#1E4D4C] mb-2 block">Título</label>
                        <input
                          type="text"
                          value={messageTitle}
                          onChange={(e) => setMessageTitle(e.target.value)}
                          placeholder="Ex: Nova campanha de coleta"
                          className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                          aria-label="Título da mensagem"
                        />
                      </div>
                      <div>
                        <label className="text-[#1E4D4C] mb-2 block">Mensagem</label>
                        <textarea
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          placeholder="Digite sua mensagem aqui..."
                          rows={6}
                          className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] focus:outline-none focus:ring-2 focus:ring-[#6B8E23] resize-none"
                          aria-label="Conteúdo da mensagem"
                        />
                      </div>
                      <AnimatedButton
                        onClick={handleSendMessage}
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                        ariaLabel="Enviar mensagem"
                      >
                        <Send className="w-4 h-4" />
                        Enviar para Todas as Escolas
                      </AnimatedButton>
                    </CardContent>
                  </Card>
                </motion.div>
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
                value="collections"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#1E4D4C] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Controle de coletas"
              >
                <Truck className="w-5 h-5" />
                <span className="text-xs">Coletas</span>
              </TabsTrigger>
              <TabsTrigger
                value="impact"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#1E4D4C] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Impacto ambiental"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs">Impacto</span>
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#1E4D4C] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Gestão de recompensas"
              >
                <Award className="w-5 h-5" />
                <span className="text-xs">Recompensas</span>
              </TabsTrigger>
              <TabsTrigger
                value="communication"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#1E4D4C] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Comunicação"
              >
                <Send className="w-5 h-5" />
                <span className="text-xs">Mensagens</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>
        </Tabs>
      </main>

      {/* Collection Modal */}
      <Dialog open={showCollectionModal} onOpenChange={setShowCollectionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E4D4C]">Concluir Coleta</DialogTitle>
            <DialogDescription>
              Informe a quantidade real de óleo coletado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-[#1E4D4C] mb-2 block">Quantidade Coletada (litros)</label>
              <input
                type="number"
                value={collectedLiters}
                onChange={(e) => setCollectedLiters(e.target.value)}
                placeholder="Ex: 150"
                className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                aria-label="Quantidade coletada em litros"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <AnimatedButton
              onClick={() => setShowCollectionModal(false)}
              variant="outline"
              className="flex-1"
              ariaLabel="Cancelar"
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton
              onClick={handleCompleteCollection}
              variant="primary"
              className="flex-1"
              ariaLabel="Confirmar coleta"
            >
              Confirmar
            </AnimatedButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
