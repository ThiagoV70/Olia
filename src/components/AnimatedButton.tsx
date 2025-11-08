import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ButtonProps } from './ui/button';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'warning';
  ariaLabel?: string;
}

export default function AnimatedButton({ 
  children, 
  variant = 'primary', 
  ariaLabel,
  className = '',
  ...props 
}: AnimatedButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#6B8E23] hover:bg-[#5a7a1e] text-white border-none';
      case 'secondary':
        return 'bg-[#1E4D4C] hover:bg-[#163a39] text-white border-none';
      case 'outline':
        return 'bg-transparent border-2 border-[#1E4D4C] text-[#1E4D4C] hover:bg-[#1E4D4C] hover:text-white';
      case 'warning':
        return 'bg-[#F7C948] hover:bg-[#f5c034] text-[#1E4D4C] border-none';
      default:
        return '';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Button
        className={`${getVariantClasses()} transition-colors ${className}`}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
