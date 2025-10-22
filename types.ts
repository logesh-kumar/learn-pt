
export interface ElementData {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: number;
  category: string;
  protons: number;
  neutrons: number;
  electrons: number;
  electronShells: number[];
  xpos: number;
  ypos: number;
  summary: string;
  discovered_by: string;
}

export interface UserProgress {
  streak: number;
  xp: number;
  level: number;
  xpToNextLevel: number;
  lastLogin: string;
}
