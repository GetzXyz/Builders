import React from 'react';
import { motion } from 'framer-motion';

const ComponentSelector: React.FC = () => {
  const components = [
    { id: 1, name: 'CPU' },
    { id: 2, name: 'GPU' },
    { id: 3, name: 'Motherboard' },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
      {components.map(component => (
        <motion.div className='bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow'
          key={component.id}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className='text-lg font-semibold'>{component.name}</h3>
          <p>Select {component.name} specifications...</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ComponentSelector;