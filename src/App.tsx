import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import RegisterUser from './components/RegisterUser';
import RegisterSchool from './components/RegisterSchool';
import DashboardUser from './components/DashboardUser';
import DashboardSchool from './components/DashboardSchool';
import DashboardGovernment from './components/DashboardGovernment';
import NotificationBanner, { Notification } from './components/NotificationBanner';

export type UserType = 'user' | 'school' | 'government' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [userType, setUserType] = useState<UserType>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setCurrentScreen('welcome');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    if (userType === 'user') {
      setCurrentScreen('dashboard-user');
    } else if (userType === 'school') {
      setCurrentScreen('dashboard-school');
    } else if (userType === 'government') {
      setCurrentScreen('dashboard-government');
    }
  };

  const handleRegister = () => {
    if (userType === 'user') {
      setCurrentScreen('register-user');
    } else if (userType === 'school') {
      setCurrentScreen('register-school');
    }
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
    setUserType(null);
  };

  const handleLogout = () => {
    setCurrentScreen('welcome');
    setUserType(null);
    // O token já é removido no DashboardUser/DashboardSchool/DashboardGovernment
  };

  const showNotification = (notif: Notification) => {
    setNotification(notif);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="size-full bg-[#F4F1ED] overflow-auto">
      <Toaster position="bottom-right" />
      <NotificationBanner 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />
      
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SplashScreen />
          </motion.div>
        )}
        
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onSelectUserType={handleSelectUserType} />
          </motion.div>
        )}
        
        {currentScreen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginScreen 
              userType={userType} 
              onLogin={handleLogin}
              onRegister={handleRegister}
              onBack={handleBackToWelcome}
            />
          </motion.div>
        )}
        
        {currentScreen === 'register-user' && (
          <motion.div
            key="register-user"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterUser 
              onComplete={handleLogin}
              onBack={() => setCurrentScreen('login')}
            />
          </motion.div>
        )}
        
        {currentScreen === 'register-school' && (
          <motion.div
            key="register-school"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterSchool 
              onComplete={handleLogin}
              onBack={() => setCurrentScreen('login')}
            />
          </motion.div>
        )}
        
        {currentScreen === 'dashboard-user' && (
          <motion.div
            key="dashboard-user"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardUser onLogout={handleLogout} showNotification={showNotification} />
          </motion.div>
        )}
        
        {currentScreen === 'dashboard-school' && (
          <motion.div
            key="dashboard-school"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardSchool onLogout={handleLogout} showNotification={showNotification} />
          </motion.div>
        )}
        
        {currentScreen === 'dashboard-government' && (
          <motion.div
            key="dashboard-government"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardGovernment onLogout={handleLogout} showNotification={showNotification} />
          </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
