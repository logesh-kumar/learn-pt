import React from 'react';
import ElementCell from './ElementCell';
import type { ElementData } from '../types';

interface PeriodicTableProps {
  elements: ElementData[];
  onSelectElement: (element: ElementData) => void;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ elements, onSelectElement }) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div 
        className="grid gap-1"
        style={{
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
        }}
      >
        {elements.map((element) => (
          <div
            key={element.atomicNumber}
            style={{ gridColumn: element.xpos, gridRow: element.ypos }}
          >
            <ElementCell
              element={element}
              onClick={() => onSelectElement(element)}
            />
          </div>
        ))}
        {/* Spacer for Lanthanides/Actinides */}
        <div style={{ gridRow: 8, gridColumn: '1 / span 18' }} />
      </div>
    </div>
  );
};

export default PeriodicTable;
