import { Droplet } from 'lucide-react';
import { motion } from 'motion/react';

export default function SplashScreen() {
  return (
    <div className="size-full flex flex-col items-center justify-center bg-[#F4F1ED]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-[#6B8E23] flex items-center justify-center shadow-lg">
            <Droplet className="w-16 h-16 text-white fill-white" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-4 border-t-[#F7C948] border-r-transparent border-b-transparent border-l-transparent rounded-full"
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-[#1E4D4C] mb-2">OLIA</h1>
          <p className="text-[#6B8E23]">Transformando óleo em sustentabilidade</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
