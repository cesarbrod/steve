import { CharacterId, PodFunction, Pod, Corner } from './types';

export const CHARACTER_SIZE = 80; // px
export const POD_SIZE = 120; // px
export const MOVEMENT_STEP = 20; // px

export const GAME_AREA_PADDING = 20; // px, padding inside the main game container

export const AVAILABLE_CHARACTERS: { id: CharacterId; name: string }[] = [
  { id: CharacterId.FISH_LIKE, name: "Sleepy Fin" },
  { id: CharacterId.ARMS_ONLY, name: "Desk Diver" },
  { id: CharacterId.LEGS_ONLY, name: "Tippy Toes" },
  { id: CharacterId.ARMS_AND_LEGS, name: "Yawning Gus" },
  { id: CharacterId.WIGGLY_LIMBS, name: "Wiggle Wobble" },
];

export const POD_DEFINITIONS: Omit<Pod, 'id' | 'corner' | 'color'>[] = [
  { func: PodFunction.MIRROR, label: "Mirror", icon: "↔️" },
  { func: PodFunction.UPSIDE_DOWN, label: "Flip", icon: "🔃" },
  { func: PodFunction.GRAYSCALE, label: "Grayscale", icon: "⚫⚪" },
];

export const SPECIAL_POD_DEFINITION: Omit<Pod, 'id' | 'corner' | 'color'> = 
  { func: PodFunction.CHANGE_SHUFFLE, label: "Change & Shuffle", icon: "🔄✨" };

export const POD_COLORS: Record<PodFunction, string> = {
  [PodFunction.MIRROR]: "bg-blue-500 hover:bg-blue-600",
  [PodFunction.UPSIDE_DOWN]: "bg-green-500 hover:bg-green-600",
  [PodFunction.GRAYSCALE]: "bg-gray-500 hover:bg-gray-600",
  [PodFunction.CHANGE_SHUFFLE]: "bg-purple-500 hover:bg-purple-600",
};

export const CORNER_POSITIONS_MAP: Record<Corner, (areaWidth: number, areaHeight: number) => { top?: number; left?: number; right?: number; bottom?: number }> = {
  [Corner.TOP_LEFT]: () => ({ top: GAME_AREA_PADDING, left: GAME_AREA_PADDING }),
  [Corner.TOP_RIGHT]: (areaWidth) => ({ top: GAME_AREA_PADDING, right: GAME_AREA_PADDING }),
  [Corner.BOTTOM_LEFT]: (areaWidth, areaHeight) => ({ bottom: GAME_AREA_PADDING, left: GAME_AREA_PADDING }),
  [Corner.BOTTOM_RIGHT]: (areaWidth, areaHeight) => ({ bottom: GAME_AREA_PADDING, right: GAME_AREA_PADDING }),
};

export const INITIAL_POD_ASSIGNMENTS: Corner[] = [
  Corner.TOP_LEFT,
  Corner.TOP_RIGHT,
  Corner.BOTTOM_LEFT,
];
export const SPECIAL_POD_CORNER = Corner.BOTTOM_RIGHT;