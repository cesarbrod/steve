export enum CharacterId {
  FISH_LIKE = "FishLike", // Simple fish, like the sleeping one
  ARMS_ONLY = "ArmsOnly", // Fish with arms, e.g., at desk
  LEGS_ONLY = "LegsOnly", // Fish with legs, e.g., handstand
  ARMS_AND_LEGS = "ArmsAndLegs", // Fish with both, e.g., yawning
  WIGGLY_LIMBS = "WigglyLimbs", // Fish with multiple wiggly/noodly limbs
}

export enum PodFunction {
  MIRROR = "Mirror Image",
  UPSIDE_DOWN = "Flip Upside Down",
  GRAYSCALE = "Grayscale",
  CHANGE_SHUFFLE = "New Creature & Shuffle Pods",
}

export interface Position {
  x: number;
  y: number;
}

export interface CharacterState {
  id: CharacterId;
  name: string; // Display name
  position: Position;
  scaleX: number;
  scaleY: number;
  isGrayscale: boolean;
  isVisible: boolean;
}

export interface Pod {
  id: string; // Unique ID for key prop, e.g., "pod-corner-tl"
  corner: Corner;
  func: PodFunction;
  label: string;
  icon: string;
  color: string; // Tailwind color class
}

export enum Corner {
  TOP_LEFT = "TOP_LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
}