
import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  streak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const StatCard: React.FC<{ icon: string; value: number; label: string; color: string; }> = ({ icon, value, label, color }) => (
  <motion.div 
    className={`flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 shadow-lg`}
    whileHover={{ scale: 1.05, y: -2 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <div className="font-black text-xl text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  </motion.div>
);

const Header: React.FC<HeaderProps> = ({ streak, level, xp, xpToNextLevel }) => {
  const xpPercentage = (xp / xpToNextLevel) * 100;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
          Periodic Table Quest
        </h1>
        <p className="text-slate-400">Master the elements, one day at a time.</p>
      </div>

      <div className="flex items-center space-x-4">
        <StatCard icon="🔥" value={streak} label="Day Streak" color="text-orange-400" />
        <div className="flex-grow">
          <StatCard icon="⭐" value={level} label="Level" color="text-yellow-400" />
        </div>
      </div>
       <div className="w-full sm:w-auto mt-4 sm:mt-0">
         <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 w-full max-w-xs mx-auto sm:max-w-none">
          <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-bold text-slate-300">XP</span>
              <span className="text-slate-400">{xp} / {xpToNextLevel}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
