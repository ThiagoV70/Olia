import { motion } from 'motion/react';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative w-16 h-16"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Gota de óleo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: [1, 0.8, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="40"
            height="48"
            viewBox="0 0 40 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 0C20 0 5 15 5 28C5 35.732 11.268 42 19 42C26.732 42 33 35.732 33 28C33 15 20 0 20 0Z"
              fill="#6B8E23"
              opacity="0.8"
            />
          </svg>
        </motion.div>

        {/* Bolhas de sabão */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-[#F7C948]/40 border-2 border-[#F7C948]"
            style={{ top: '10%', left: '20%' }}
            animate={{
              y: [-10, -30],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute w-4 h-4 rounded-full bg-[#F7C948]/40 border-2 border-[#F7C948]"
            style={{ top: '30%', right: '15%' }}
            animate={{
              y: [-10, -40],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-[#F7C948]/40 border-2 border-[#F7C948]"
            style={{ bottom: '20%', left: '30%' }}
            animate={{
              y: [-10, -35],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.6,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
