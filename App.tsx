
import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PeriodicTable from './components/PeriodicTable';
import ElementDetailView from './components/ElementDetailView';
import Header from './components/Header';
import { useUserProgress } from './hooks/useUserProgress';
import { periodicTableElements } from './constants';
import type { ElementData } from './types';

export default function App() {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const userProgress = useUserProgress();

  const handleSelectElement = (element: ElementData) => {
    setSelectedElement(element);
  };

  const handleCloseDetail = () => {
    setSelectedElement(null);
  };

  // Memoize elements to prevent re-mapping on every render
  const elements = useMemo(() => periodicTableElements, []);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-4 overflow-x-hidden">
      <Header
        streak={userProgress.streak}
        level={userProgress.level}
        xp={userProgress.xp}
        xpToNextLevel={userProgress.xpToNextLevel}
      />
      <main className="mt-8">
        <AnimatePresence mode="wait">
          {selectedElement ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <ElementDetailView
                element={selectedElement}
                onClose={handleCloseDetail}
              />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <PeriodicTable
                elements={elements}
                onSelectElement={handleSelectElement}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="text-center text-xs text-slate-500 mt-12 pb-4">
        <p>Periodic Table Quest - Learn Chemistry the Fun Way!</p>
         <p className="mt-2">This is a concept app and is not a complete game. Atomic models are illustrative (Bohr model) and not to scale.</p>
      </footer>
    </div>
  );
}
