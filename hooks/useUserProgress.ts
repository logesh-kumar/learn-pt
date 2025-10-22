
import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '../types';

const getInitialProgress = (): UserProgress => {
  try {
    const item = window.localStorage.getItem('userProgress');
    if (item) {
      const parsed = JSON.parse(item) as UserProgress;
      const today = new Date().toISOString().split('T')[0];
      const lastLoginDate = new Date(parsed.lastLogin);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // Check if streak should be reset
      if (lastLoginDate.toISOString().split('T')[0] !== today && lastLoginDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0]) {
         parsed.streak = 0;
      }
      
      // Update last login to today if it's not already
      if (parsed.lastLogin !== today) {
        if(lastLoginDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            parsed.streak += 1; // Increment streak if login was yesterday
        } else if (parsed.streak === 0) {
            parsed.streak = 1;
        }
        parsed.lastLogin = today;
      }
      
      return parsed;
    }
  } catch (error) {
    console.error("Error reading from localStorage", error);
  }

  return {
    streak: 1,
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
    lastLogin: new Date().toISOString().split('T')[0],
  };
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem('userProgress', JSON.stringify(progress));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [progress]);

  const addXp = useCallback((amount: number) => {
    setProgress(current => {
      let newXp = current.xp + amount;
      let newLevel = current.level;
      let newXpToNextLevel = current.xpToNextLevel;

      while (newXp >= newXpToNextLevel) {
        newXp -= newXpToNextLevel;
        newLevel += 1;
        newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
      }
      
      return { ...current, xp: newXp, level: newLevel, xpToNextLevel: newXpToNextLevel };
    });
  }, []);
  
  // This hook could be expanded with more functions to manage progress
  // For this app, we are only reading the values in the header.
  
  return progress;
}
