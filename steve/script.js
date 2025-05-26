document.addEventListener('DOMContentLoaded', () => {
  // --- Game Elements ---
  const gameArea = document.getElementById('game-area');
  const characterElement = document.getElementById('character');
  const instructionText = document.getElementById('instruction-text');

  // --- Game Constants ---
  const CHARACTER_SIZE = 60; // px
  const POD_SIZE = 90;       // px
  const MOVEMENT_STEP = 15;  // px
  const GAME_AREA_PADDING = 10; // px, padding inside the game area

  // --- Enums & Definitions ---
  const CharacterId = {
    FISH_LIKE: "FishLike",
    ARMS_ONLY: "ArmsOnly",
    LEGS_ONLY: "LegsOnly",
    ARMS_AND_LEGS: "ArmsAndLegs",
    WIGGLY_LIMBS: "WigglyLimbs",
  };

  const PodFunction = {
    MIRROR: "Mirror Image",
    UPSIDE_DOWN: "Flip Upside Down",
    GRAYSCALE: "Grayscale",
    CHANGE_SHUFFLE: "New Steve & Shuffle Pods",
  };

  const Corner = {
    TOP_LEFT: "TOP_LEFT",
    TOP_RIGHT: "TOP_RIGHT",
    BOTTOM_LEFT: "BOTTOM_LEFT",
    BOTTOM_RIGHT: "BOTTOM_RIGHT",
  };

  const CHARACTER_SVGS = {
    [CharacterId.FISH_LIKE]: () => `
      <g stroke="black" stroke-width="1.5">
        <ellipse cx="35" cy="40" rx="25" ry="18" fill="#FFA500" />
        <path d="M60 40 Q 70 30 70 40 Q 70 50 60 40 Z" fill="#FFA500" />
        <path d="M35 22 Q 30 15 40 15 T 35 22" fill="#FFA500" />
        <ellipse cx="25" cy="38" rx="4" ry="7" fill="white" />
        <circle cx="24" cy="38" r="2" fill="black" />
        <path d="M20 45 Q 25 48 30 45" stroke-width="1" fill="none" />
      </g>`,
    [CharacterId.ARMS_ONLY]: () => `
      <g stroke="black" stroke-width="1.5">
        <ellipse cx="35" cy="35" rx="22" ry="18" fill="#FFA500" />
        <path d="M57 35 Q 65 25 70 35 Q 65 45 57 35 Z" fill="#FFA500" />
        <circle cx="30" cy="32" r="7" fill="white" />
        <circle cx="28" cy="32" r="3.5" fill="black" />
        <path d="M20 30 Q 10 25 5 35 Q 10 40 20 38" fill="#FFA500" />
        <path d="M50 30 Q 60 25 65 35 Q 60 40 50 38" fill="#FFA500" />
        <path d="M30 42 Q 35 45 40 42" stroke-width="1" fill="none" />
      </g>`,
    [CharacterId.LEGS_ONLY]: () => `
      <g stroke="black" stroke-width="1.5">
        <ellipse cx="35" cy="30" rx="20" ry="16" fill="#FFA500" />
        <path d="M55 30 Q 63 20 63 30 Q 63 40 55 30 Z" fill="#FFA500" />
        <circle cx="30" cy="28" r="6" fill="white" />
        <circle cx="28" cy="28" r="3" fill="black" />
        <path d="M28 45 Q 25 60 20 65 L 15 63 Q 20 58 25 45 Z" fill="#FFA500" />
        <path d="M42 45 Q 45 60 50 65 L 55 63 Q 50 58 45 45 Z" fill="#FFA500" />
        <path d="M30 38 Q 35 41 40 38" stroke-width="1" fill="none" />
      </g>`,
    [CharacterId.ARMS_AND_LEGS]: () => `
      <g stroke="black" stroke-width="1.5">
        <ellipse cx="35" cy="35" rx="23" ry="19" fill="#FFA500" />
        <path d="M58 35 Q 68 25 68 35 Q 68 45 58 35 Z" fill="#FFA500" />
        <circle cx="30" cy="30" r="8" fill="white" />
        <circle cx="28" cy="30" r="4" fill="black" />
        <path d="M25 25 Q 15 15 10 28 Q 18 30 25 28 Z" fill="#FFA500" />
        <path d="M45 25 Q 55 15 60 28 Q 52 30 45 28 Z" fill="#FFA500" />
        <path d="M28 53 Q 25 65 20 68 L 17 65 Q 22 60 26 53 Z" fill="#FFA500" />
        <path d="M42 53 Q 45 65 50 68 L 53 65 Q 48 60 44 53 Z" fill="#FFA500" />
        <ellipse cx="35" cy="42" rx="8" ry="5" fill="black" />
      </g>`,
    [CharacterId.WIGGLY_LIMBS]: () => `
      <g stroke="black" stroke-width="1.5">
        <ellipse cx="35" cy="35" rx="20" ry="20" fill="#FFA500" />
        <path d="M55 35 Q 60 30 62 35 Q 60 40 55 35 Z" fill="#FFA500" />
        <circle cx="32" cy="32" r="7" fill="white" />
        <circle cx="30" cy="32" r="3.5" fill="black" />
        <path d="M20 25 C 15 20, 10 30, 15 35 S 25 40, 20 30 Z" fill="#FFA500" stroke-dasharray="2 2" />
        <path d="M50 25 C 55 20, 60 30, 55 35 S 45 40, 50 30 Z" fill="#FFA500" stroke-dasharray="2 2" />
        <path d="M25 50 C 20 55, 30 60, 35 55 S 40 45, 30 50 Z" fill="#FFA500" stroke-dasharray="2 2" />
        <path d="M45 50 C 40 55, 50 60, 55 55 S 60 45, 50 50 Z" fill="#FFA500" stroke-dasharray="2 2" />
        <path d="M30 42 Q 35 44 40 42" stroke-width="1" fill="none" />
      </g>`,
  };

  const AVAILABLE_CHARACTERS = Object.keys(CharacterId).map(key => ({
    id: CharacterId[key],
    name: CharacterId[key].replace(/([A-Z])/g, ' $1').trim() // Format name like "Fish Like"
  }));

  const STANDARD_POD_DEFINITIONS = [
    { func: PodFunction.MIRROR, label: "Espelho", icon: "↔️", color: "blue" },
    { func: PodFunction.UPSIDE_DOWN, label: "Virar", icon: "🔃", color: "green" },
    { func: PodFunction.GRAYSCALE, label: "Cinza", icon: "⚫⚪", color: "gray" },
  ];
  
  const SPECIAL_POD_DEFINITION = { 
    func: PodFunction.CHANGE_SHUFFLE, 
    label: "Novo Steve & Misturar", 
    icon: "🔄✨",
    color: "purple"
  };
  const SPECIAL_POD_FIXED_CORNER = Corner.BOTTOM_RIGHT;


  // --- Game State ---
  let character = null; // { id, name, position: {x, y}, scaleX, scaleY, isGrayscale, domElement }
  let pods = []; // { id, corner, func, label, icon, color, domElement }
  let gameAreaRect = { width: 0, height: 0, left: 0, top: 0 };
  let messageTimeout = null;
  let canMove = false;

  // --- Utility Functions ---
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function displayMessage(text, duration = 2000) {
    instructionText.textContent = text;
    if (messageTimeout) clearTimeout(messageTimeout);
    if (duration > 0) {
      messageTimeout = setTimeout(() => {
        instructionText.textContent = "Use as setinhas para movimentar o Steve!";
      }, duration);
    }
  }

  // --- Character Functions ---
  function initializeNewCharacter() {
    const charInfo = AVAILABLE_CHARACTERS[Math.floor(Math.random() * AVAILABLE_CHARACTERS.length)];
    character = {
      id: charInfo.id,
      name: charInfo.name,
      position: {
        x: gameAreaRect.width / 2 - CHARACTER_SIZE / 2,
        y: gameAreaRect.height / 2 - CHARACTER_SIZE / 2,
      },
      scaleX: 1,
      scaleY: 1,
      isGrayscale: false,
      domElement: characterElement
    };
    renderCharacter(true); // Initial render, make visible after delay
  }

  function renderCharacter(teleportIn = false) {
    if (!character) return;
    const el = character.domElement;
    el.style.left = `${character.position.x}px`;
    el.style.top = `${character.position.y}px`;
    el.style.transform = `scaleX(${character.scaleX}) scaleY(${character.scaleY})`;
    el.style.filter = character.isGrayscale ? 'grayscale(100%)' : 'none';
    
    const svgContent = CHARACTER_SVGS[character.id] ? CHARACTER_SVGS[character.id]() : '';
    el.innerHTML = `<svg viewBox="0 0 70 70">${svgContent}</svg>`;
    
    if (teleportIn) {
      el.style.opacity = '0';
      setTimeout(() => { 
        el.style.opacity = '1';
        canMove = true; 
      }, 150);
    } else {
      el.style.opacity = '1';
    }
  }

  // --- Pod Functions ---
  function setupPods() {
    // Clear existing pod DOM elements
    pods.forEach(p => p.domElement?.remove());
    pods = [];

    let availableCorners = Object.values(Corner).filter(c => c !== SPECIAL_POD_FIXED_CORNER);
    shuffleArray(availableCorners);

    STANDARD_POD_DEFINITIONS.forEach((def, index) => {
      const pod = createPodObject(def, availableCorners[index], `pod-standard-${index}`);
      pods.push(pod);
      gameArea.appendChild(pod.domElement);
    });

    const specialPod = createPodObject(SPECIAL_POD_DEFINITION, SPECIAL_POD_FIXED_CORNER, 'pod-special');
    pods.push(specialPod);
    gameArea.appendChild(specialPod.domElement);

    renderPods();
  }
  
  function createPodObject(definition, corner, idBase) {
    const podEl = document.createElement('div');
    podEl.classList.add('pod', `pod-color-${definition.color}`);
    podEl.id = `${idBase}-${corner}`;
    podEl.innerHTML = `<span class="pod-icon" aria-hidden="true">${definition.icon}</span>`;
    podEl.setAttribute('aria-label', definition.label);

    return {
      id: podEl.id,
      corner: corner,
      func: definition.func,
      label: definition.label,
      icon: definition.icon,
      color: definition.color,
      domElement: podEl
    };
  }

  function renderPods() {
    pods.forEach(pod => {
      const pos = getCornerPosition(pod.corner);
      pod.domElement.style.left = pos.left !== undefined ? `${pos.left}px` : 'auto';
      pod.domElement.style.right = pos.right !== undefined ? `${pos.right}px` : 'auto';
      pod.domElement.style.top = pos.top !== undefined ? `${pos.top}px` : 'auto';
      pod.domElement.style.bottom = pos.bottom !== undefined ? `${pos.bottom}px` : 'auto';
    });
  }
  
  function getCornerPosition(corner) {
    const pos = {};
    const padding = GAME_AREA_PADDING;
    switch (corner) {
      case Corner.TOP_LEFT:     pos.top = padding; pos.left = padding; break;
      case Corner.TOP_RIGHT:    pos.top = padding; pos.right = padding; break;
      case Corner.BOTTOM_LEFT:  pos.bottom = padding; pos.left = padding; break;
      case Corner.BOTTOM_RIGHT: pos.bottom = padding; pos.right = padding; break;
    }
    return pos;
  }
  
  function shuffleStandardPodPositions() {
    const standardPods = pods.filter(p => p.func !== PodFunction.CHANGE_SHUFFLE);
    let currentStandardCorners = standardPods.map(p => p.corner);
    shuffleArray(currentStandardCorners);
    standardPods.forEach((p, index) => {
        p.corner = currentStandardCorners[index];
    });
    renderPods();
  }


  // --- Game Logic ---
  function handleKeyDown(event) {
    if (!character || !canMove) return;

    let { x, y } = character.position;
    let moved = false;
    switch (event.key) {
      case 'ArrowUp':    y -= MOVEMENT_STEP; moved = true; break;
      case 'ArrowDown':  y += MOVEMENT_STEP; moved = true; break;
      case 'ArrowLeft':  x -= MOVEMENT_STEP; moved = true; break;
      case 'ArrowRight': x += MOVEMENT_STEP; moved = true; break;
    }

    if (moved) {
      event.preventDefault();
      // Boundary checks (ensure character stays within game area, considering padding)
      const minX = GAME_AREA_PADDING;
      const maxX = gameAreaRect.width - CHARACTER_SIZE - GAME_AREA_PADDING;
      const minY = GAME_AREA_PADDING;
      const maxY = gameAreaRect.height - CHARACTER_SIZE - GAME_AREA_PADDING;

      character.position.x = Math.max(minX, Math.min(x, maxX));
      character.position.y = Math.max(minY, Math.min(y, maxY));
      
      renderCharacter();
      checkCollisions();
    }
  }

  function checkCollisions() {
    const charRect = {
      left: character.position.x,
      top: character.position.y,
      right: character.position.x + CHARACTER_SIZE,
      bottom: character.position.y + CHARACTER_SIZE,
    };

    for (const pod of pods) {
      const podPos = getCornerPosition(pod.corner);
      // Calculate absolute pod rect based on gameAreaRect and pod's corner style
      const podLeft = podPos.left !== undefined ? podPos.left : gameAreaRect.width - (podPos.right || 0) - POD_SIZE;
      const podTop = podPos.top !== undefined ? podPos.top : gameAreaRect.height - (podPos.bottom || 0) - POD_SIZE;

      const podRect = {
        left: podLeft,
        top: podTop,
        right: podLeft + POD_SIZE,
        bottom: podTop + POD_SIZE,
      };

      if (
        charRect.left < podRect.right &&
        charRect.right > podRect.left &&
        charRect.top < podRect.bottom &&
        charRect.bottom > podRect.top
      ) {
        applyPodEffect(pod);
        return; // Apply only one effect per move
      }
    }
  }

  function applyPodEffect(activatedPod) {
    canMove = false; // Prevent movement during effect
    displayMessage(`Steve ativou: ${activatedPod.label}!`);

    switch (activatedPod.func) {
      case PodFunction.MIRROR:
        character.scaleX *= -1;
        break;
      case PodFunction.UPSIDE_DOWN:
        character.scaleY *= -1;
        break;
      case PodFunction.GRAYSCALE:
        character.isGrayscale = !character.isGrayscale;
        break;
      case PodFunction.CHANGE_SHUFFLE:
        character.domElement.style.opacity = '0'; // Make current Steve disappear
        setTimeout(() => {
          initializeNewCharacter(); // Creates new Steve, will teleport in
          shuffleStandardPodPositions();
          // initializeNewCharacter will set canMove = true after teleport
        }, 300); // Delay for visual effect
        return; // Return early as new character handles its own rendering and canMove
    }
    renderCharacter();
    setTimeout(() => { canMove = true; }, 300); // Re-enable movement after effect animation
  }

  // --- Initialization ---
  function updateGameAreaSize() {
    const rect = gameArea.getBoundingClientRect();
    gameAreaRect = {
        width: gameArea.offsetWidth, // Use offsetWidth for internal size
        height: gameArea.offsetHeight, // Use offsetHeight for internal size
        left: rect.left,
        top: rect.top
    };
  }
  
  function initGame() {
    if (!gameArea || !characterElement || !instructionText) {
      console.error("Essential game elements not found!");
      alert("Erro: Elementos essenciais do jogo não foram encontrados. Tente recarregar a página.");
      return;
    }

    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'loading-message';
    loadingMsg.textContent = 'Carregando Steve...';
    gameArea.appendChild(loadingMsg);

    characterElement.style.width = `${CHARACTER_SIZE}px`;
    characterElement.style.height = `${CHARACTER_SIZE}px`;
    
    // Ensure dimensions are available
    function attemptLayout() {
        updateGameAreaSize();
        if (gameAreaRect.width > 0 && gameAreaRect.height > 0) {
            if(loadingMsg) loadingMsg.remove();
            initializeNewCharacter();
            setupPods();
            window.addEventListener('keydown', handleKeyDown);
            displayMessage("Use as setinhas para movimentar o Steve!");
        } else {
            // Retry if dimensions aren't set (e.g. CSS not fully loaded)
            console.warn("Game area dimensions not ready, retrying...");
            requestAnimationFrame(attemptLayout);
        }
    }
    attemptLayout(); // Start the layout process

    // Optional: Recalculate on resize, might be complex with fixed aspect ratio
    // window.addEventListener('resize', () => {
    //   updateGameAreaSize();
    //   renderCharacter(); // Reposition character if needed
    //   renderPods(); // Reposition pods
    // });
  }

  initGame();
});