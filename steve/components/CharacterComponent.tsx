import React from 'react';
import { CharacterState, CharacterId } from '../types';
import { CHARACTER_SIZE } from '../constants';

interface CharacterProps {
  character: CharacterState | null;
}

// SVG designs for each character type
const SVGs: Record<CharacterId, React.FC> = {
  [CharacterId.FISH_LIKE]: () => ( // Simple fish, like sleeping one
    <g stroke="black" strokeWidth="1.5">
      <ellipse cx="35" cy="40" rx="25" ry="18" fill="#FFA500" />
      <path d="M60 40 Q 70 30 70 40 Q 70 50 60 40 Z" fill="#FFA500" /> {/* Tail */}
      <path d="M35 22 Q 30 15 40 15 T 35 22" fill="#FFA500" /> {/* Dorsal fin */}
      <ellipse cx="25" cy="38" rx="4" ry="7" fill="white" /> {/* Eye */}
      <circle cx="24" cy="38" r="2" fill="black" />
      <path d="M20 45 Q 25 48 30 45" strokeWidth="1" fill="none" /> {/* Mouth (sleepy) */}
    </g>
  ),
  [CharacterId.ARMS_ONLY]: () => ( // Fish with arms, e.g., at desk
    <g stroke="black" strokeWidth="1.5">
      <ellipse cx="35" cy="35" rx="22" ry="18" fill="#FFA500" /> {/* Body */}
      <path d="M57 35 Q 65 25 70 35 Q 65 45 57 35 Z" fill="#FFA500" /> {/* Tail */}
      <circle cx="30" cy="32" r="7" fill="white" /> {/* Eye */}
      <circle cx="28" cy="32" r="3.5" fill="black" />
      {/* Arms */}
      <path d="M20 30 Q 10 25 5 35 Q 10 40 20 38" fill="#FFA500" /> {/* Left Arm */}
      <path d="M50 30 Q 60 25 65 35 Q 60 40 50 38" fill="#FFA500" /> {/* Right Arm */}
      <path d="M30 42 Q 35 45 40 42" strokeWidth="1" fill="none" /> {/* Mouth */}
    </g>
  ),
  [CharacterId.LEGS_ONLY]: () => ( // Fish with legs, e.g., handstand
    <g stroke="black" strokeWidth="1.5">
      <ellipse cx="35" cy="30" rx="20" ry="16" fill="#FFA500" /> {/* Body */}
      <path d="M55 30 Q 63 20 63 30 Q 63 40 55 30 Z" fill="#FFA500" /> {/* Tail */}
      <circle cx="30" cy="28" r="6" fill="white" /> {/* Eye */}
      <circle cx="28" cy="28" r="3" fill="black" />
      {/* Legs */}
      <path d="M28 45 Q 25 60 20 65 L 15 63 Q 20 58 25 45 Z" fill="#FFA500" /> {/* Left Leg */}
      <path d="M42 45 Q 45 60 50 65 L 55 63 Q 50 58 45 45 Z" fill="#FFA500" /> {/* Right Leg */}
      <path d="M30 38 Q 35 41 40 38" strokeWidth="1" fill="none" /> {/* Mouth */}
    </g>
  ),
  [CharacterId.ARMS_AND_LEGS]: () => ( // Fish with both, e.g., yawning
    <g stroke="black" strokeWidth="1.5">
      <ellipse cx="35" cy="35" rx="23" ry="19" fill="#FFA500" /> {/* Body */}
      <path d="M58 35 Q 68 25 68 35 Q 68 45 58 35 Z" fill="#FFA500" /> {/* Tail */}
      <circle cx="30" cy="30" r="8" fill="white" /> {/* Eye */}
      <circle cx="28" cy="30" r="4" fill="black" />
      {/* Arms */}
      <path d="M25 25 Q 15 15 10 28 Q 18 30 25 28 Z" fill="#FFA500" /> {/* Left Arm up */}
      <path d="M45 25 Q 55 15 60 28 Q 52 30 45 28 Z" fill="#FFA500" /> {/* Right Arm up */}
      {/* Legs */}
      <path d="M28 53 Q 25 65 20 68 L 17 65 Q 22 60 26 53 Z" fill="#FFA500" /> {/* Left Leg */}
      <path d="M42 53 Q 45 65 50 68 L 53 65 Q 48 60 44 53 Z" fill="#FFA500" /> {/* Right Leg */}
      <ellipse cx="35" cy="42" rx="8" ry="5" fill="black" /> {/* Yawning Mouth */}
    </g>
  ),
  [CharacterId.WIGGLY_LIMBS]: () => ( // Fish with multiple wiggly/noodly limbs
    <g stroke="black" strokeWidth="1.5">
      <ellipse cx="35" cy="35" rx="20" ry="20" fill="#FFA500" /> {/* Round Body */}
      <path d="M55 35 Q 60 30 62 35 Q 60 40 55 35 Z" fill="#FFA500" /> {/* Small Tail */}
      <circle cx="32" cy="32" r="7" fill="white" /> {/* Eye */}
      <circle cx="30" cy="32" r="3.5" fill="black" />
      {/* Wiggly Limbs */}
      <path d="M20 25 C 15 20, 10 30, 15 35 S 25 40, 20 30 Z" fill="#FFA500" strokeDasharray="2 2" />
      <path d="M50 25 C 55 20, 60 30, 55 35 S 45 40, 50 30 Z" fill="#FFA500" strokeDasharray="2 2" />
      <path d="M25 50 C 20 55, 30 60, 35 55 S 40 45, 30 50 Z" fill="#FFA500" strokeDasharray="2 2" />
      <path d="M45 50 C 40 55, 50 60, 55 55 S 60 45, 50 50 Z" fill="#FFA500" strokeDasharray="2 2" />
      <path d="M30 42 Q 35 44 40 42" strokeWidth="1" fill="none" /> {/* Mouth */}
    </g>
  ),
};


const CharacterSvgWrapper: React.FC<{charId: CharacterId}> = ({ charId }) => {
  const SelectedSvg = SVGs[charId] || SVGs[CharacterId.FISH_LIKE]; // Fallback
  return (
    <svg 
      viewBox="0 0 70 70" 
      width={CHARACTER_SIZE} 
      height={CHARACTER_SIZE} 
      className="drop-shadow-lg"
      aria-label={`Creature type: ${charId}`}
    >
      <SelectedSvg />
    </svg>
  );
};


const CharacterComponent: React.FC<CharacterProps> = ({ character }) => {
  if (!character || !character.isVisible) {
    return null;
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${character.position.x}px`,
    top: `${character.position.y}px`,
    width: `${CHARACTER_SIZE}px`,
    height: `${CHARACTER_SIZE}px`,
    transform: `scaleX(${character.scaleX}) scaleY(${character.scaleY})`,
    filter: character.isGrayscale ? 'grayscale(100%)' : 'none',
    transition: 'opacity 0.3s ease-in-out, transform 0.2s ease, filter 0.3s ease',
    opacity: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  };

  return (
    <div style={style} className="z-10" role="img" aria-label={`Character: ${character.name}`}>
      <CharacterSvgWrapper charId={character.id} />
      {/* Removed character name span */}
    </div>
  );
};

export default CharacterComponent;