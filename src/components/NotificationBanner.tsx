import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Truck, Gift, Info } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'collection' | 'reward' | 'soap' | 'info';
  message: string;
}

interface NotificationBannerProps {
  notification: Notification | null;
  onClose: () => void;
}

export default function NotificationBanner({ notification, onClose }: NotificationBannerProps) {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'collection':
        return <Truck className="w-5 h-5" />;
      case 'reward':
        return <Gift className="w-5 h-5" />;
      case 'soap':
        return <Gift className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-[#6B8E23] text-white';
      case 'warning':
        return 'bg-[#F7C948] text-[#1E4D4C]';
      case 'collection':
        return 'bg-[#1E4D4C] text-white';
      case 'reward':
        return 'bg-[#F7C948] text-[#1E4D4C]';
      case 'soap':
        return 'bg-[#6B8E23] text-white';
      case 'info':
        return 'bg-[#1E4D4C] text-white';
      default:
        return 'bg-[#1E4D4C] text-white';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div className={`${getColors()} rounded-2xl shadow-2xl p-4 flex items-center gap-3`}>
          <div className="flex-shrink-0">{getIcon()}</div>
          <p className="flex-1">{notification.message}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Fechar notificação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
