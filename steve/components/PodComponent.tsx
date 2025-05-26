
import React from 'react';
import { Pod, Corner } from '../types';
import { POD_SIZE, CORNER_POSITIONS_MAP } from '../constants';

interface PodProps {
  pod: Pod;
  gameAreaWidth: number;
  gameAreaHeight: number;
}

const PodComponent: React.FC<PodProps> = ({ pod, gameAreaWidth, gameAreaHeight }) => {
  if (gameAreaWidth === 0 || gameAreaHeight === 0) return null;

  const positionStyle = CORNER_POSITIONS_MAP[pod.corner](gameAreaWidth, gameAreaHeight);

  const style: React.CSSProperties = {
    position: 'absolute',
    width: `${POD_SIZE}px`,
    height: `${POD_SIZE}px`,
    ...positionStyle,
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <div
      style={style}
      className={`flex flex-col items-center justify-center p-2 border-4 border-dashed border-gray-700 rounded-lg text-white text-center shadow-xl ${pod.color}`}
      aria-label={`Teleportation Pod: ${pod.label}`}
    >
      <span className="text-3xl mb-1">{pod.icon}</span>
      {/* Removed pod label span */}
    </div>
  );
};

export default PodComponent;