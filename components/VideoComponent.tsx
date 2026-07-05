import React from 'react';
import { useScroll } from 'framer-motion';
import { motion } from 'framer-motion';

interface VideoProps {}

const VideoComponent: React.FC<VideoProps> = () => {
  const scroll = useScroll();  // Get scroll position and progress (0-1)

  return (
    <motion.div className='relative mx-auto max-w-7xl w-full px-4' layout='relative'>
      {/* Animated video container with scroll effects -->
      <motion.video
        className='absolute top-0 left-0 w-full h-screen transform'
        autoPlay
        viewportScale={scroll.progress}  // Scale video based on scroll progress
        onScroll={{ progress: scroll.progress, ease: 'easeOut' }}  // Scroll interaction
        transition={{ type: 'scale', duration: 0.5 }}">
        <source src='/videos/pc-showcase.mp4' type='video/mp4' />
      </motion.video>

      {/* Scroll-activated gradient overlay -->
      <div className='absolute bottom-0 left-0 w-full h-20 transition-opacity'
        style={{ opacity: scroll.progress * 0.5 + 0.5 }}>
        <div className='relative h-20 w-full bg-gradient-to-r from-transparent to-white'></div>
      </div>
    </motion.div>
  );
};

export default VideoComponent;