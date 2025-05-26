
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CharacterState, Pod, PodFunction, CharacterId, Position, Corner } from './types';
import { AVAILABLE_CHARACTERS, CHARACTER_SIZE, POD_SIZE, MOVEMENT_STEP, POD_DEFINITIONS, SPECIAL_POD_DEFINITION, POD_COLORS, GAME_AREA_PADDING, INITIAL_POD_ASSIGNMENTS, SPECIAL_POD_CORNER, CORNER_POSITIONS_MAP } from './constants';
import CharacterComponent from './components/CharacterComponent';
import PodComponent from './components/PodComponent';

const App: React.FC = () => {
  const [character, setCharacter] = useState<CharacterState | null>(null);
  const [pods, setPods] = useState<Pod[]>([]);
  const [gameAreaSize, setGameAreaSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("Use arrow keys to move!");

  const initializeNewCharacter = useCallback((areaWidth: number, areaHeight: number): CharacterState => {
    const randomCharInfo = AVAILABLE_CHARACTERS[Math.floor(Math.random() * AVAILABLE_CHARACTERS.length)];
    return {
      id: randomCharInfo.id,
      name: randomCharInfo.name,
      position: {
        x: areaWidth / 2 - CHARACTER_SIZE / 2,
        y: areaHeight / 2 - CHARACTER_SIZE / 2,
      },
      scaleX: 1,
      scaleY: 1,
      isGrayscale: false,
      isVisible: false, // Will be set to true after a short delay
    };
  }, []);

  const shufflePodFunctions = useCallback(() => {
    let availableDefinitions = [...POD_DEFINITIONS];
    // Fisher-Yates shuffle
    for (let i = availableDefinitions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableDefinitions[i], availableDefinitions[j]] = [availableDefinitions[j], availableDefinitions[i]];
    }
    return availableDefinitions;
  }, []);

  const setupPods = useCallback((shuffledDefinitions: Omit<Pod, 'id' | 'corner' | 'color'>[]) => {
    const newPods: Pod[] = [];
    INITIAL_POD_ASSIGNMENTS.forEach((corner, index) => {
      const definition = shuffledDefinitions[index];
      newPods.push({
        id: `pod-${corner}-${definition.func.replace(/\s+/g, '')}`,
        corner: corner,
        func: definition.func,
        label: definition.label,
        icon: definition.icon,
        color: POD_COLORS[definition.func],
      });
    });
    newPods.push({
      id: `pod-${SPECIAL_POD_CORNER}-${SPECIAL_POD_DEFINITION.func.replace(/\s+/g, '')}`,
      corner: SPECIAL_POD_CORNER,
      func: SPECIAL_POD_DEFINITION.func,
      label: SPECIAL_POD_DEFINITION.label,
      icon: SPECIAL_POD_DEFINITION.icon,
      color: POD_COLORS[SPECIAL_POD_DEFINITION.func],
    });
    setPods(newPods);
  }, []);
  
  useEffect(() => {
    if (gameAreaRef.current) {
      const { offsetWidth, offsetHeight } = gameAreaRef.current;
      setGameAreaSize({ width: offsetWidth, height: offsetHeight });
      
      if (!character) {
        const newChar = initializeNewCharacter(offsetWidth, offsetHeight);
        setCharacter(newChar);
        setTimeout(() => setCharacter(c => c ? {...c, isVisible: true} : null), 100); // Teleport effect
      }
      if (pods.length === 0) {
         setupPods(shufflePodFunctions());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, pods.length, initializeNewCharacter, setupPods, shufflePodFunctions]);


  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!character || !character.isVisible || gameAreaSize.width === 0) return;

    let { x, y } = character.position;
    switch (event.key) {
      case 'ArrowUp': y -= MOVEMENT_STEP; break;
      case 'ArrowDown': y += MOVEMENT_STEP; break;
      case 'ArrowLeft': x -= MOVEMENT_STEP; break;
      case 'ArrowRight': x += MOVEMENT_STEP; break;
      default: return;
    }

    // Boundary checks
    const minX = GAME_AREA_PADDING;
    const maxX = gameAreaSize.width - CHARACTER_SIZE - GAME_AREA_PADDING;
    const minY = GAME_AREA_PADDING;
    const maxY = gameAreaSize.height - CHARACTER_SIZE - GAME_AREA_PADDING;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));
    
    const newPosition = { x, y };
    setCharacter(c => c ? { ...c, position: newPosition } : null);
    checkCollisions({ ...character, position: newPosition });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- gameAreaSize and character are part of the condition or new state
  }, [character, gameAreaSize]);

  const checkCollisions = useCallback((updatedCharacter: CharacterState) => {
    if (!updatedCharacter.isVisible || gameAreaSize.width === 0) return;

    const charRect = {
      left: updatedCharacter.position.x,
      top: updatedCharacter.position.y,
      right: updatedCharacter.position.x + CHARACTER_SIZE,
      bottom: updatedCharacter.position.y + CHARACTER_SIZE,
    };

    for (const pod of pods) {
      const cornerStyle = CORNER_POSITIONS_MAP[pod.corner](gameAreaSize.width, gameAreaSize.height);
      // Calculate pod absolute position.
      // This is a simplified collision detection as CORNER_POSITIONS_MAP gives style props, not raw x,y.
      // Assuming pod top-left (x,y) is derived from these styles.
      let podX = 0, podY = 0;
      if (cornerStyle.left !== undefined) podX = cornerStyle.left;
      if (cornerStyle.right !== undefined) podX = gameAreaSize.width - cornerStyle.right - POD_SIZE;
      if (cornerStyle.top !== undefined) podY = cornerStyle.top;
      if (cornerStyle.bottom !== undefined) podY = gameAreaSize.height - cornerStyle.bottom - POD_SIZE;


      const podRect = {
        left: podX,
        top: podY,
        right: podX + POD_SIZE,
        bottom: podY + POD_SIZE,
      };

      if (
        charRect.left < podRect.right &&
        charRect.right > podRect.left &&
        charRect.top < podRect.bottom &&
        charRect.bottom > podRect.top
      ) {
        applyPodEffect(pod.func);
        setMessage(`Activated: ${pod.label}!`);
        setTimeout(() => setMessage("Use arrow keys to move!"), 2000);
        return; // Apply only one effect per move
      }
    }
  }, [pods, gameAreaSize]);

  const applyPodEffect = useCallback((func: PodFunction) => {
    setCharacter(currentChar => {
      if (!currentChar) return null;
      let newCharState = { ...currentChar };
      switch (func) {
        case PodFunction.MIRROR:
          newCharState.scaleX *= -1;
          break;
        case PodFunction.UPSIDE_DOWN:
          newCharState.scaleY *= -1;
          break;
        case PodFunction.GRAYSCALE:
          newCharState.isGrayscale = !newCharState.isGrayscale;
          break;
        case PodFunction.CHANGE_SHUFFLE:
          if (gameAreaSize.width > 0 && gameAreaSize.height > 0) {
            newCharState = initializeNewCharacter(gameAreaSize.width, gameAreaSize.height);
            newCharState.isVisible = true; // Make visible immediately
          }
          setupPods(shufflePodFunctions());
          break;
      }
      return newCharState;
    });
  }, [gameAreaSize, initializeNewCharacter, setupPods, shufflePodFunctions]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-4">
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">Creature Teleport Game</h1>
      <p className="text-lg text-yellow-300 mb-6 h-8 transition-opacity duration-300">{message}</p>
      <div 
        ref={gameAreaRef} 
        className="relative w-full max-w-3xl aspect-[4/3] bg-white/30 backdrop-blur-sm rounded-xl shadow-2xl border-4 border-white/50 overflow-hidden"
      >
        {gameAreaSize.width > 0 && pods.map(pod => (
          <PodComponent key={pod.id} pod={pod} gameAreaWidth={gameAreaSize.width} gameAreaHeight={gameAreaSize.height} />
        ))}
        <CharacterComponent character={character} />
        {(!character || !character.isVisible) && gameAreaSize.width > 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-white bg-black/30">
                Loading Creature...
            </div>
        )}
      </div>
      <footer className="mt-6 text-center text-sm text-white/80">
        <p>Personagem baseado em "Le Poisson Steve" (Steve, o Peixe), de @vigzvigz.</p>
        <p>A música é de @tomomp3</p>
      </footer>
    </div>
  );
};

export default App;
