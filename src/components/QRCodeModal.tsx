import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Copy, Download } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { toast } from 'sonner@2.0.3';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  qrCodeValue: string;
  type: 'donation' | 'pickup';
}

export default function QRCodeModal({
  isOpen,
  onClose,
  title,
  subtitle,
  qrCodeValue,
  type,
}: QRCodeModalProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(qrCodeValue);
    toast.success('Código copiado!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#1E4D4C] text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{subtitle}</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Animation overlay */}
          <div className="relative">
            {/* Animated background */}
            <AnimatePresence>
              {type === 'donation' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 100, opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeIn',
                    }}
                    className="w-6 h-8 bg-[#6B8E23] rounded-full"
                    style={{
                      clipPath: 'ellipse(50% 60% at 50% 40%)',
                    }}
                  />
                </div>
              )}

              {type === 'pickup' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 100, x: i * 30 - 30, opacity: 0 }}
                      animate={{ 
                        y: -100, 
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeOut',
                      }}
                      className="absolute w-8 h-8 bg-[#F7C948]/30 rounded-full border-2 border-[#F7C948]"
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* QR Code placeholder */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative bg-white p-8 rounded-2xl mx-auto w-64 h-64 flex items-center justify-center border-4 border-[#6B8E23]"
            >
              <div className="w-full h-full bg-[#1E4D4C]/10 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-[#1E4D4C] rounded-xl mb-4 grid grid-cols-4 gap-1 p-2">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-sm"
                        style={{
                          opacity: Math.random() > 0.5 ? 1 : 0,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#1E4D4C] font-mono break-all px-4">
                    {qrCodeValue}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex gap-3">
          <AnimatedButton
            onClick={handleCopy}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            ariaLabel="Copiar código"
          >
            <Copy className="w-4 h-4" />
            Copiar Código
          </AnimatedButton>
          <AnimatedButton
            onClick={onClose}
            variant="primary"
            className="flex-1"
            ariaLabel="Fechar"
          >
            Fechar
          </AnimatedButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
