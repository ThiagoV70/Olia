import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Droplet,
  MapPin,
  Gift,
  History,
  User,
  LogOut,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Map as MapIcon,
  Loader2,
  Navigation,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AnimatedButton from './AnimatedButton';
import QRCodeModal from './QRCodeModal';
import LoadingAnimation from './LoadingAnimation';
import { Notification } from './NotificationBanner';
import { toast } from 'sonner';
import { userApi, schoolApi, donationApi, pickupApi, authApi } from '../services/api';

interface DashboardUserProps {
  onLogout: () => void;
  showNotification: (notification: Notification) => void;
}

export default function DashboardUser({ onLogout, showNotification }: DashboardUserProps) {
  const [activeTab, setActiveTab] = useState('map');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [userData, setUserData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [donationHistory, setDonationHistory] = useState<any[]>([]);
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profile, stats, schoolsData, donations, pickups] = await Promise.all([
        userApi.getProfile().catch(() => null),
        userApi.getStats().catch(() => null),
        schoolApi.getAll().catch(() => []),
        donationApi.getUserDonations().catch(() => []),
        pickupApi.getLocations().catch(() => []),
      ]);

      if (profile) {
        setUserData(profile);
        setEditFormData(profile);
      }
      if (stats) setUserStats(stats);
      setSchools(schoolsData);
      setDonationHistory(donations);
      setPickupLocations(pickups);
    } catch (error: any) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const progress = userStats ? (userStats.totalLiters / userStats.nextReward) * 100 : 0;

  const handleDonateClick = async (school: any) => {
    try {
      // Aqui você pode pedir a quantidade de litros ao usuário
      const liters = prompt('Quantos litros você deseja doar?');
      if (!liters || parseFloat(liters) <= 0) return;

      const response = await donationApi.create(school.id, parseFloat(liters));
      setSelectedSchool(school);
      setShowQRModal(true);
      toast.success('Doação registrada com sucesso!');
      loadData(); // Recarregar dados
    } catch (error: any) {
      toast.error(error.message || 'Erro ao registrar doação');
    }
  };

  const handlePickupClick = async (location: any) => {
    try {
      await pickupApi.request(location.id);
      setShowQRModal(true);
      toast.success('Retirada confirmada!');
      showNotification({
        id: Date.now().toString(),
        type: 'soap',
        message: `Sabão disponível para retirada em ${location.name}`,
      });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao confirmar retirada');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await userApi.updateProfile(editFormData);
      toast.success('Alterações salvas com sucesso!');
      setShowProfileEdit(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar alterações');
    }
  };

  const handleLogout = () => {
    authApi.logout();
    onLogout();
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#F4F1ED] flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="h-screen bg-[#F4F1ED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1E4D4C] mb-4">Erro ao carregar dados do usuário</p>
          <Button onClick={loadData}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

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
              className="w-12 h-12 rounded-full bg-[#6B8E23] flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Droplet className="w-6 h-6 text-white fill-white" />
            </motion.div>
            <h1 className="text-[#1E4D4C]">OLIA</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <User className="w-5 h-5 text-[#1E4D4C]" />
              <span className="text-[#1E4D4C]">{userData?.name || 'Carregando...'}</span>
            </div>
            <AnimatedButton
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
              ariaLabel="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Sair</span>
            </AnimatedButton>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {/* Mapa Tab */}
            <TabsContent value="map" className="m-0 p-0 h-full flex flex-col">
              {/* Filtros */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 bg-white border-b border-[#E5E5E5] flex-shrink-0"
              >
                  <div className="max-w-6xl mx-auto flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] hover:bg-[#E5E5E5] transition-colors"
                      aria-label="Filtrar escolas"
                    >
                      <Filter className="w-4 h-4" />
                      Filtros
                    </motion.button>
                    {filterOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2"
                      >
                        <Badge
                          variant={selectedFilter === 'all' ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setSelectedFilter('all')}
                        >
                          Todas
                        </Badge>
                        <Badge
                          variant={selectedFilter === 'centro' ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setSelectedFilter('centro')}
                        >
                          Centro
                        </Badge>
                        <Badge
                          variant={selectedFilter === 'jardim' ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setSelectedFilter('jardim')}
                        >
                          Jardim
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

              {/* Mapa (simulado) */}
              <div className="flex-1 relative bg-gradient-to-br from-[#E5E5E5] to-[#F4F1ED] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-[#1E4D4C]/30">
                    <MapIcon className="w-32 h-32" />
                  </div>

                  {/* Marcadores das escolas */}
                  <div className="absolute inset-0 p-8">
                    {schools.map((school, index) => (
                      <motion.div
                        key={school.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          position: 'absolute',
                          left: `${20 + index * 25}%`,
                          top: `${30 + index * 15}%`,
                        }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedSchool(school)}
                          className="relative group"
                          aria-label={`Ver ${school.name}`}
                        >
                          <div className="w-12 h-12 bg-[#6B8E23] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                            <MapPin className="w-6 h-6 text-white fill-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#F7C948] rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-[#1E4D4C]">{index + 1}</span>
                          </div>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Cartão de escola selecionada */}
                  {selectedSchool && (
                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 max-w-2xl mx-auto z-30"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-[#1E4D4C] mb-1">{selectedSchool.name}</h3>
                            <div className="flex items-center gap-2 text-[#6B8E23] mb-2">
                            <Navigation className="w-4 h-4" />
                            <span className="text-sm">{selectedSchool.neighborhood || 'Bairro'}</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedSchool(null)}
                          className="text-2xl text-[#1E4D4C] hover:text-[#6B8E23] w-8 h-8 flex items-center justify-center"
                          aria-label="Fechar"
                        >
                          ×
                        </motion.button>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-[#1E4D4C]">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{selectedSchool.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#1E4D4C] text-sm">Capacidade disponível:</span>
                          <Badge variant="outline" className="bg-[#6B8E23]/10 text-[#6B8E23]">
                            {selectedSchool.capacity || 0}%
                          </Badge>
                        </div>
                      </div>

                      <AnimatedButton
                        onClick={() => handleDonateClick(selectedSchool)}
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                        ariaLabel="Doar óleo nesta escola"
                      >
                        <Droplet className="w-5 h-5" />
                        Doar óleo aqui
                      </AnimatedButton>
                    </motion.div>
                  )}
              </div>
            </TabsContent>

            {/* Histórico Tab */}
            <TabsContent value="history" className="m-0 p-6 pb-24">
              <div className="max-w-4xl mx-auto space-y-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Histórico de Doações</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">
                    Acompanhe todas as suas contribuições
                  </p>
                </motion.div>

                <div className="space-y-4">
                  {donationHistory.map((donation, index) => (
                    <motion.div
                      key={donation.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-[#6B8E23]/10 flex items-center justify-center">
                                  <Droplet className="w-6 h-6 text-[#6B8E23]" />
                                </div>
                        <div>
                          <h4 className="text-[#1E4D4C]">{donation.school?.name || 'Escola'}</h4>
                          <div className="flex items-center gap-2 text-sm text-[#1E4D4C]/70">
                            <Calendar className="w-3 h-3" />
                            {new Date(donation.donatedAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <div className="ml-15 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[#1E4D4C]/70">Quantidade:</span>
                          <span className="text-[#6B8E23]">{donation.liters}L</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#1E4D4C]/70">Código:</span>
                          <span className="text-[#1E4D4C] font-mono text-sm">
                            {donation.code}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {donation.status === 'CONFIRMED' ? (
                                <Badge className="bg-[#6B8E23] text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Confirmado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[#F7C948] border-[#F7C948]">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pendente
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Retirada Tab */}
            <TabsContent value="pickup" className="m-0 p-6 pb-24">
              <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-2">Retirada de Sabão</h2>
                  <p className="text-[#1E4D4C]/70 mb-6">
                    Benefício para famílias cadastradas no Bolsa Família
                  </p>
                </motion.div>

                {/* Status de elegibilidade */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="border-none shadow-lg bg-gradient-to-br from-[#6B8E23] to-[#1E4D4C] text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                          <h3>Você está elegível!</h3>
                          <p className="opacity-90 mt-1">
                            Cadastro Bolsa Família: {userData.bolsaFamilia || 'Não cadastrado'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Locais de retirada */}
                <div className="space-y-4">
                  <h3 className="text-[#1E4D4C]">Locais Disponíveis</h3>
                  {pickupLocations.map((location, index) => (
                    <motion.div
                      key={location.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-none shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-full bg-[#F7C948]/20 flex items-center justify-center">
                                <Gift className="w-6 h-6 text-[#F7C948]" />
                              </div>
                              <div>
                                <h4 className="text-[#1E4D4C]">{location.name}</h4>
                                <p className="text-sm text-[#1E4D4C]/70">{location.address}</p>
                              </div>
                            </div>
                            <Badge className="bg-[#6B8E23] text-white">Disponível</Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-[#1E4D4C]">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(location.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#1E4D4C]">
                              <Clock className="w-4 h-4" />
                              <span>{location.startTime} - {location.endTime}</span>
                            </div>
                          </div>

                          <AnimatedButton
                            onClick={() => handlePickupClick(location)}
                            variant="warning"
                            className="w-full"
                            ariaLabel={`Confirmar retirada em ${location.name}`}
                          >
                            Confirmar Retirada
                          </AnimatedButton>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Perfil Tab */}
            <TabsContent value="profile" className="m-0 p-6 pb-24">
              <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-[#1E4D4C] mb-6">Meu Perfil</h2>
                </motion.div>

                {/* Estatísticas de Impacto */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="border-none shadow-lg bg-gradient-to-br from-[#6B8E23] to-[#1E4D4C] text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Seu Impacto Ambiental
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl mb-1">{userStats?.totalLiters || 0}L</div>
                          <p className="opacity-90">Óleo reciclado</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl mb-1">{userStats?.co2Saved || 0}kg</div>
                          <p className="opacity-90">CO₂ evitado</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl mb-1">{userStats?.rewardsEarned || 0}</div>
                          <p className="opacity-90">Sabões recebidos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Progresso para próxima recompensa */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-[#1E4D4C] flex items-center gap-2">
                        <Gift className="w-5 h-5 text-[#F7C948]" />
                        Progresso para Próxima Recompensa
                      </CardTitle>
                      <CardDescription>
                        Faltam {userStats ? userStats.nextReward - userStats.totalLiters : 0}L para receber seu próximo sabão
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progress} className="h-3 mb-2" />
                      <div className="flex justify-between text-sm text-[#1E4D4C]/70">
                        <span>{userStats?.totalLiters || 0}L</span>
                        <span>{userStats?.nextReward || 0}L</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Dados pessoais */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-[#1E4D4C]">Dados Pessoais</CardTitle>
                      {!showProfileEdit && (
                        <AnimatedButton
                          onClick={() => {
                            setEditFormData({ ...userData });
                            setShowProfileEdit(true);
                          }}
                          variant="outline"
                          className="text-sm"
                          ariaLabel="Editar perfil"
                        >
                          Editar
                        </AnimatedButton>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-[#1E4D4C]/70 mb-1 block">Nome completo</label>
                        <input
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          disabled={!showProfileEdit}
                          className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                          aria-label="Nome completo"
                        />
                      </div>
                      <div>
                        <label className="text-[#1E4D4C]/70 mb-1 block">Email</label>
                        <input
                          type="email"
                          value={editFormData.email || ''}
                          disabled
                          className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] disabled:opacity-70"
                          aria-label="Email"
                        />
                      </div>
                      <div>
                        <label className="text-[#1E4D4C]/70 mb-1 block">Telefone</label>
                        <input
                          type="tel"
                          value={editFormData.phone || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          disabled={!showProfileEdit}
                          className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                          aria-label="Telefone"
                        />
                      </div>
                      <div>
                        <label className="text-[#1E4D4C]/70 mb-1 block">Endereço</label>
                        <input
                          type="text"
                          value={editFormData.address || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                          disabled={!showProfileEdit}
                          className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                          aria-label="Endereço"
                        />
                      </div>
                      <div>
                        <label className="text-[#1E4D4C]/70 mb-1 block">Nº Bolsa Família</label>
                        <input
                          type="text"
                          value={editFormData.bolsaFamilia || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, bolsaFamilia: e.target.value })}
                          disabled={!showProfileEdit}
                          className="w-full p-3 rounded-xl bg-[#F4F1ED] text-[#1E4D4C] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                          aria-label="Número do Bolsa Família"
                        />
                      </div>

                      {showProfileEdit && (
                        <div className="flex gap-3 pt-4">
                          <AnimatedButton
                            onClick={handleSaveProfile}
                            variant="primary"
                            className="flex-1"
                            ariaLabel="Salvar alterações"
                          >
                            Salvar Alterações
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => setShowProfileEdit(false)}
                            variant="outline"
                            className="flex-1"
                            ariaLabel="Cancelar edição"
                          >
                            Cancelar
                          </AnimatedButton>
                        </div>
                      )}
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
                value="map"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Mapa de pontos de coleta"
              >
                <MapIcon className="w-5 h-5" />
                <span className="text-xs">Mapa</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Histórico de doações"
              >
                <History className="w-5 h-5" />
                <span className="text-xs">Histórico</span>
              </TabsTrigger>
              <TabsTrigger
                value="pickup"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Retirada de sabão"
              >
                <Gift className="w-5 h-5" />
                <span className="text-xs">Retirada</span>
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex flex-col items-center justify-center gap-1 py-2.5 data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white data-[state=inactive]:text-[#1E4D4C]/70 rounded-xl transition-all"
                aria-label="Perfil do usuário"
              >
                <User className="w-5 h-5" />
                <span className="text-xs">Perfil</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>
        </Tabs>
      </main>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title={selectedSchool ? 'Doação Registrada!' : 'Retirada Confirmada!'}
        subtitle={
          selectedSchool
            ? 'Apresente este QR Code na escola'
            : 'Apresente este QR Code na farmácia'
        }
        qrCodeValue={`OLIA-${Date.now()}`}
        type={selectedSchool ? 'donation' : 'pickup'}
      />
    </div>
  );
}
