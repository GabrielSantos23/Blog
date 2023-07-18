import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SplashScreenProps {
  isLoading: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  const splashScreenVariants = {
    initial: { y: 0 },
    animate: { y: isLoading ? 0 : '-100%' },
  };

  const splashScreenTransition = {
    duration: 0.5,
  };

  return (
    <>
      <motion.div
        className='w-full h-full dark:bg-black bg-white absolute z-50 top-0 left-0'
        initial='initial'
        animate='animate'
        transition={splashScreenTransition}
        variants={splashScreenVariants}
      >
        <div className='flex items-center justify-center h-full'>
          <Image
            width={150}
            height={150}
            src='/logoG.gif'
            alt='logo'
            className='w-[150px] h'
          />
        </div>
      </motion.div>
    </>
  );
};

export default SplashScreen;
