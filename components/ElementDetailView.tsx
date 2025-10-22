import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { getFunFact } from '../services/geminiService';
import type { ElementData } from '../types';

const AtomModel = lazy(() => import('./AtomModel'));

interface ElementDetailViewProps {
  element: ElementData;
  onClose: () => void;
}

const getCategoryColor = (category: string) => {
    if (category.includes('noble gas')) return 'border-purple-500';
    if (category.includes('alkali metal')) return 'border-red-500';
    if (category.includes('alkaline earth metal')) return 'border-orange-500';
    if (category.includes('transition metal')) return 'border-yellow-500';
    if (category.includes('lanthanide')) return 'border-green-500';
    if (category.includes('actinide')) return 'border-teal-500';
    if (category.includes('metalloid')) return 'border-cyan-500';
    if (category.includes('post-transition metal')) return 'border-blue-500';
    if (category.includes('halogen')) return 'border-pink-500';
    if (category.includes('nonmetal')) return 'border-indigo-500';
    return 'border-gray-500';
};

const ElementDetailView: React.FC<ElementDetailViewProps> = ({ element, onClose }) => {
  const [funFact, setFunFact] = useState<string>('Summoning a fun fact from the cosmos...');
  const [isLoadingFact, setIsLoadingFact] = useState<boolean>(true);

  const fetchFunFact = async (name: string) => {
      setIsLoadingFact(true);
      const fact = await getFunFact(name);
      setFunFact(fact);
      setIsLoadingFact(false);
  };

  useEffect(() => {
    fetchFunFact(element.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  const colorClass = getCategoryColor(element.category);

  return (
    <motion.div layoutId={`element-card-${element.atomicNumber}`} className="max-w-6xl mx-auto p-4 sm:p-6 bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl sm:text-6xl font-black">{element.name} ({element.symbol})</h1>
          <p className={`text-xl font-bold capitalize mt-1 ${colorClass.replace('border-', 'text-')}`}>{element.category}</p>
        </div>
        <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors">
          &larr; Back
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border-2 border-slate-700">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400">Loading 3D Model...</div>}>
            <AtomModel 
                protons={element.protons} 
                neutrons={element.neutrons} 
                electronsPerShell={element.electronShells} 
            />
          </Suspense>
        </div>
        
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-3xl font-black text-sky-300">{element.atomicNumber}</div>
                    <div className="text-sm text-slate-400">Atomic Number</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-3xl font-black text-red-400">{element.protons}</div>
                    <div className="text-sm text-slate-400">Protons</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-3xl font-black text-slate-300">{element.neutrons}</div>
                    <div className="text-sm text-slate-400">Neutrons</div>
                </div>
                 <div className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-3xl font-black text-blue-400">{element.electrons}</div>
                    <div className="text-sm text-slate-400">Electrons</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg col-span-2 sm:col-span-1">
                    <div className="text-3xl font-black">{element.atomicMass.toFixed(3)}</div>
                    <div className="text-sm text-slate-400">Atomic Mass</div>
                </div>
            </div>
            
             <div className="p-4 bg-slate-900/50 rounded-lg">
                <h3 className="font-bold text-lg">Summary</h3>
                <p className="text-slate-300 mt-1">{element.summary}</p>
                <p className="text-sm text-slate-500 mt-2">Discovered by: {element.discovered_by}</p>
             </div>

             <div className="p-4 bg-gradient-to-br from-slate-900/50 to-indigo-900/30 rounded-lg">
                <h3 className="font-bold text-lg text-yellow-300 flex items-center">
                    <span className="text-2xl mr-2">🔮</span> Gemini Fun Fact
                </h3>
                <p className={`text-slate-200 mt-2 transition-opacity duration-300 ${isLoadingFact ? 'opacity-50' : 'opacity-100'}`}>
                    {funFact}
                </p>
                <button 
                    onClick={() => fetchFunFact(element.name)} 
                    disabled={isLoadingFact}
                    className="mt-3 px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-md font-bold transition-all disabled:bg-indigo-800 disabled:cursor-not-allowed"
                >
                    {isLoadingFact ? 'Thinking...' : 'New Fact'}
                </button>
             </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ElementDetailView;
