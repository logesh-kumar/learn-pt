import React from 'react';
import { motion } from 'framer-motion';
import type { ElementData } from '../types';

interface ElementCellProps {
  element: ElementData;
  onClick: () => void;
}

const getCategoryColor = (category: string) => {
  if (category.includes('noble gas')) return 'bg-purple-600 hover:bg-purple-500';
  if (category.includes('alkali metal')) return 'bg-red-600 hover:bg-red-500';
  if (category.includes('alkaline earth metal')) return 'bg-orange-600 hover:bg-orange-500';
  if (category.includes('transition metal')) return 'bg-yellow-600 hover:bg-yellow-500';
  if (category.includes('lanthanide')) return 'bg-green-600 hover:bg-green-500';
  if (category.includes('actinide')) return 'bg-teal-600 hover:bg-teal-500';
  if (category.includes('metalloid')) return 'bg-cyan-600 hover:bg-cyan-500';
  if (category.includes('post-transition metal')) return 'bg-blue-600 hover:bg-blue-500';
  if (category.includes('halogen')) return 'bg-pink-500 hover:bg-pink-400';
  if (category.includes('nonmetal')) return 'bg-indigo-600 hover:bg-indigo-500';
  return 'bg-gray-600 hover:bg-gray-500';
};

const ElementCell: React.FC<ElementCellProps> = ({ element, onClick }) => {
  const colorClass = getCategoryColor(element.category);
  
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full h-full p-1 sm:p-2 rounded-md aspect-square flex flex-col justify-center items-center cursor-pointer text-white shadow-md transition-colors duration-300 ${colorClass}`}
      whileHover={{ scale: 1.1, zIndex: 10, boxShadow: '0px 10px 20px rgba(0,0,0,0.4)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      layoutId={`element-card-${element.atomicNumber}`}
    >
      <div className="absolute top-1 left-1 text-xs opacity-80">{element.atomicNumber}</div>
      <div className="text-lg sm:text-2xl font-black">{element.symbol}</div>
      <div className="hidden sm:block text-[10px] text-center leading-tight px-1">{element.name}</div>
    </motion.button>
  );
};

export default ElementCell;